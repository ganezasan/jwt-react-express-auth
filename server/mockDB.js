const mockDB = {
  users: {
    records:[{
      id:"1",
      name:"Hibohiboo",
      email: "joe@example.com",
      password:"password",
    }],
    findById(id, cb) {
      process.nextTick(() => {
        var idx = id - 1;
        var record=this.records[idx];
        if (record) {
          cb(null, record);
        } else {
          cb(new Error('User ' + id + ' does not exist'));
        }
      });
    },
    findByEmail(email, cb){
      process.nextTick(()=> {
        for (var i = 0, len = this.records.length; i < len; i++) {
          var record = this.records[i];
          if (record.email === email) {
            return cb(null, record);
          }
        }
        return cb(null, null);
      });
    }
  }
};

module.exports = mockDB;
