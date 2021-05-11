const mongoose = require('mongoose') ;

const { Schema } = mongoose ;

const storeSchema = new Schema({
    Name: {
        type: String,
        require:true,
        unique: true,
        min:2
    },
    Alies: {
        type: String
    },
    Address: {
        City: String,
        State: String,
        Country: String,
        ZipCode:{
            type : Number ,
            Min : 5 ,
            Max :5,
        },
        require: true
    },
    PhoneNumber: {
        unique: true,
        require:true,
        validate: {
            validator: function(v) {
              return /\d{3}-\d{3}-\d{4}/.test(v);
            }
        },
        type: String
    },
    Email: {
        require:true,
        validator : {
            validate: function(v){
                return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            }
        },
        type: String,
    },
    Photo: {
        type: String
    }
    // _id: {
    //     type: Schema.Types.ObjectId
    // },
    // User_id: {
    //     type: Schema.Types.ObjectId
    // },
   

});
storeSchema.method('transform', function() {
    var obj = this.toObject();
    
    //Rename fields
    obj.id = obj._id;
    delete obj._id;

    return obj;
});

const storeModel = mongoose.model('store',storeSchema);

module.exports = storeModel ;
