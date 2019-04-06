import { Mongo } from 'meteor/mongo';


TestCollection = new Mongo.Collection('testcollection');


const makeRandomString = function(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};

insertDataForPerformanceTest = function() {
  console.log("Removing all old data first.");
  TestCollection.remove({});

  const numberOfEntriesToInsert = 200*1000;

  console.log(`Starting to insert ${numberOfEntriesToInsert} entries.`);
  let tStart = new Date();
  for (var i = 0; i < numberOfEntriesToInsert; ++i) {
    TestCollection.insert(
      {
        field1: makeRandomString(10),
        field2: makeRandomString(10),
        field3: makeRandomString(10),
        field4: makeRandomString(10),
        createdAt: new Date(),
        createBy: 'insertDataForPerformanceTest'
    });
  }
  let tEnd = new Date();
  console.log(`Inserting ${numberOfEntriesToInsert} entries took ${(tEnd-tStart)/1000} [s].`);
};

runPerformanceTest = function() {
  console.log("Running performance test.");
  let tStart = new Date();

  const testIds = TestCollection.find({}, {fields: {_id: 1}}).fetch().map(x => x._id);
  console.log(`Found ${testIds.length} documents to test.`);

  var sliceIx = 0;

  // Slice the data into chunks so that we don't prefetch all data because that could overflow the heap
  while (testIds.length - sliceIx > 0) {
    const rest = testIds.length - sliceIx;
    var sliceAmount = (rest > 10000) ? 10000 : rest;
    const testIdsSlice = testIds.slice(sliceIx, sliceIx + sliceAmount); // Kanske ta minus 1 här
    console.log(`Checked ${sliceIx} of ${testIds.length} documents.`);
    sliceIx += sliceAmount;

    const testDocuments = TestCollection.find({_id: {$in: testIdsSlice}}).fetch();
    console.log(`${testDocuments.length} documents fetched`);
  }

  let tEnd = new Date();
  console.log(`Performance test with ${testIds.length} entries took ${(tEnd-tStart)/1000} [s].`);
};
