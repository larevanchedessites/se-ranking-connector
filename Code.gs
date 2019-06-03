function getAuthType() {
  var response = {
    'type': 'NONE'
  };
  return response;
}

function getConfig(request) {
  var config = {
    configParams: [
      {
        type: 'TEXTINPUT',
        name: 'token',
        displayName: 'Token',
        helpText: 'Enter the auth token you get from login',
        placeholder: 'i.e. : c3b7ce7ae4cce5a6312f4046b701da9d',
      },
      {
        type: 'TEXTINPUT',
        name: 'siteid',
        displayName: 'Site ID',
        helpText: 'Enter the unique identifier of the website',
        placeholder: 'i.e. : 123',
      },
      {
        type: 'TEXTINPUT',
        name: 'datestart',
        displayName: 'Start date',
        helpText: 'Optional.  The start date',
        placeholder: 'i.e. : yyyy-mm-dd',
      },
      {
        type: 'TEXTINPUT',
        name: 'dateend',
        displayName: 'End date',
        helpText: 'Optional.  The end date',
        placeholder: 'i.e. : yyyy-mm-dd',
      },
    ]
  };
  return config;
}

var fixedSchema = [
  {
    name: 'Date',
    label: 'Date',
    description: 'Date',
    dataType: 'STRING',
    semantics: {
      conceptType: 'DIMENSION',
      semanticType: 'YEAR_MONTH_DAY',
      semanticGroup: 'DATETIME'
    }
  },
  {
    name: 'SiteEngineId',
    label: 'Site Engine ID',
    description: 'Site Engine ID',
    dataType: 'NUMBER',
    semantics: {
      conceptType: 'METRIC',
      semanticType: 'NUMBER',
      semanticGroup: 'NUMERIC'
    }
  },
  {
    name: 'Keyword',
    label: 'Keyword',
    description: 'Keyword',
    dataType: 'STRING',
    semantics: {
      conceptType: 'DIMENSION',
      semanticType: 'TEXT',
      semanticGroup: 'TEXT',
    },
  },
  {
    name: 'Position',
    label: 'Position',
    description: 'Position',
    dataType: 'NUMBER',
    semantics: {
      conceptType: 'METRIC',
      semanticType: 'NUMBER',
      semanticGroup: 'NUMERIC'
    }
  },
  {
    name: 'Volume',
    label: 'Volume',
    description: 'Volume',
    dataType: 'NUMBER',
    semantics: {
      conceptType: 'METRIC',
      semanticType: 'NUMBER',
      semanticGroup: 'NUMERIC'
    }
  }
];

function getSchema(request) {
  return {schema: fixedSchema};
};

function isAdminUser() {
  return true;
}

function getData(request) {
  // Prepare the schema for the fields requested.
  var dataSchema = [];

  request.fields.forEach(function(field) {
    for (var i = 0; i < fixedSchema.length; i++) {
      if (fixedSchema[i].name === field.name) {
        dataSchema.push(fixedSchema[i]);
        break;
      }
    }
  });

  // Craft URL
  var url = [
    'https://api4.seranking.com/sites/',request.configParams.siteid,'/positions?',
    'date_from=', request.configParams.datestart,
    '&date_to=', request.configParams.dateend
  ].join('');
  var token = ['Token ', request.configParams.token].join('');
  var options = {
    'method': 'GET',
    'headers': {
      'Authorization': token
    }
  };

  // Fetch the data.
  var response = JSON.parse(UrlFetchApp.fetch(url, options));
  var keywords = response[0].keywords;

  // Prepare the tabular data.
  var data = [];
  keywords.forEach(function(keyword) {
    // Provide values in the order defined by the schema.
    keyword.positions.forEach(function(position) {

      var values = [];
      dataSchema.forEach(function(field) {
        switch(field.name) {
          case 'Date':
            values.push(position.date.replace('-', '').replace('-', ''));
            break;
          case 'Keyword':
            values.push(keyword.name);
            break;
          case 'SiteEngineId':
            values.push(response[0].site_engine_id);
            break;
          case 'Position':
            values.push(position.pos);
            break;
          case 'Volume':
            values.push(keyword.volume);
            break;
          default:
            values.push('');
        }
      });

      data.push({
        values: values
      });

    });
  });

  return {
    schema: dataSchema,
    rows: data
  };
}
