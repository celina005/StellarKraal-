'use strict';

var dbm;
var type;
var seed;
var fs = require('fs');
var path = require('path');
var Promise;

exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
  Promise = options.Promise;
};

exports.up = function(db) {
  var filePath = path.join(__dirname, 'sqls', '20260425000000-initial-schema-up.sql');
  return new Promise(function(resolve, reject) {
    fs.readFile(filePath, { encoding: 'utf-8' }, function(err, data) {
      if (err) return reject(err);
      resolve(data);
    });
  }).then(function(data) {
    return db.runSql(data);
  }).then(function() {
    return db.runSql(
      'CREATE TABLE IF NOT EXISTS appraisal_config (' +
      '  id SERIAL PRIMARY KEY,' +
      '  animal_type VARCHAR(64) NOT NULL UNIQUE,' +
      '  base_value NUMERIC(14, 2) NOT NULL,' +
      '  depreciation_rate NUMERIC(6, 4) NOT NULL DEFAULT 0,' +
      '  ltv_ratio NUMERIC(6, 4) NOT NULL DEFAULT 0,' +
      '  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),' +
      '  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()' +
      ');'
    );
  });
};

exports.down = function(db) {
  var filePath = path.join(__dirname, 'sqls', '20260425000000-initial-schema-down.sql');
  return new Promise(function(resolve, reject) {
    fs.readFile(filePath, { encoding: 'utf-8' }, function(err, data) {
      if (err) return reject(err);
      resolve(data);
    });
  }).then(function(data) {
    return db.runSql(data);
  }).then(function() {
    return db.runSql('DROP TABLE IF EXISTS appraisal_config;');
  });
};

exports._meta = {
  version: 1
};
