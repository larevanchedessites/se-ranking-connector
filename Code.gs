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
    name: 'Change',
    label: 'Change',
    description: 'Change',
    dataType: 'NUMBER',
    semantics: {
      conceptType: 'METRIC',
      semanticType: 'NUMBER',
      semanticGroup: 'NUMERIC'
    }
  },
  {
    name: 'Price',
    label: 'Price',
    description: 'Price',
    dataType: 'NUMBER',
    semantics: {
      conceptType: 'METRIC',
      semanticType: 'NUMBER',
      semanticGroup: 'NUMERIC'
    }
  },
  {
    name: 'IsMap',
    label: 'IsMap',
    description: 'IsMap',
    dataType: 'BOOLEAN',
    semantics: {
      conceptType: 'METRIC',
      semanticType: 'BOOLEAN',
      semanticGroup: 'BOOLEAN'
    }
  },
  {
    name: 'MapPosition',
    label: 'MapPosition',
    description: 'MapPosition',
    dataType: 'NUMBER',
    semantics: {
      conceptType: 'METRIC',
      semanticType: 'NUMBER',
      semanticGroup: 'NUMERIC'
    }
  },
  {
    name: 'PaidPosition',
    label: 'PaidPosition',
    description: 'PaidPosition',
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
  },
  {
    name: 'Competition',
    label: 'Competition',
    description: 'Competition',
    dataType: 'NUMBER',
    semantics: {
      conceptType: 'METRIC',
      semanticType: 'NUMBER',
      semanticGroup: 'NUMERIC'
    }
  },
  {
    name: 'SuggestedBid',
    label: 'SuggestedBid',
    description: 'SuggestedBid',
    dataType: 'NUMBER',
    semantics: {
      conceptType: 'METRIC',
      semanticType: 'NUMBER',
      semanticGroup: 'NUMERIC'
    }
  },
  {
    name: 'KeywordEfficiencyIndex',
    label: 'KeywordEfficiencyIndex',
    description: 'KeywordEfficiencyIndex',
    dataType: 'NUMBER',
    semantics: {
      conceptType: 'METRIC',
      semanticType: 'NUMBER',
      semanticGroup: 'NUMERIC'
    }
  },
  {
    name: 'Results',
    label: 'Results',
    description: 'Results',
    dataType: 'NUMBER',
    semantics: {
      conceptType: 'METRIC',
      semanticType: 'NUMBER',
      semanticGroup: 'NUMERIC'
    }
  },
  {
    name: 'TotalSum',
    label: 'TotalSum',
    description: 'TotalSum',
    dataType: 'NUMBER',
    semantics: {
      conceptType: 'METRIC',
      semanticType: 'NUMBER',
      semanticGroup: 'NUMERIC'
    }
  },
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
    '&date_to=', request.configParams.dateend,
    '&with_landing_pages=1',
    '&with_serp_features=1'
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

  // Prepare the tabular data.
  var data = [];
  response.forEach(function(site) {
    var keywords = site.keywords;
    keywords.forEach(function(keyword) {
      // Provide values in the order defined by the schema.
      keyword.positions.forEach(function(position) {
        var values = [];
        dataSchema.forEach(function(field) {
          switch(field.name) {
            case 'SiteEngineId':
              values.push(site.site_engine_id);
              break;
            case 'Volume':
              values.push(keyword.volume);
              break;
            case 'Keyword':
              values.push(keyword.name);
              break;
            case 'Competition':
              values.push(keyword.competition);
              break;
            case 'SuggestedBid':
              values.push(keyword.suggested_bid);
              break;
            case 'KeywordEfficiencyIndex':
              values.push(keyword.kei);
              break;
            case 'Results':
              values.push(keyword.results);
              break;
            case 'TotalSum':
              values.push(keyword.total_sum);
              break;
            case 'Date':
              values.push(position.date.replace('-', '').replace('-', ''));
              break;
            case 'Position':
              values.push(position.pos);
              break;
            case 'Change':
              values.push(position.change);
              break;
            case 'Price':
              values.push(position.price);
              break;
            case 'IsMap':
              values.push(position.is_map?true:false);
              break;
            case 'MapPosition':
              values.push(position.map_position);
              break;
            case 'PaidPosition':
              values.push(position.paid_position);
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
  });

  return {
    schema: dataSchema,
    rows: data
  };
}
