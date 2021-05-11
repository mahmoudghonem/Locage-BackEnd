const mongoose = require('mongoose') ;

const { Schema } = mongoose ;

const StoreSchema = new Schema({
    name: {
        type: String,
        require:true,
        unique: true,
        min:2
    },
    alies: {
        type: String
    },
    address: {
        city: String,
        state: String,
        country: String,
        zipCode:{
            type : Number ,
            Min : 5 ,
            Max :5,
        },
        require: true
    },
    phoneNumber: {
        unique: true,
        require:true,
        validate: {
            validator: function(v) {
              return /\d{3}-\d{3}-\d{4}/.test(v);
            }
        },
        type: String
    },
    email: {
        require:true,
        validator : {
            validate: function(v){
                return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            }
        },
        type: String,
    },
    photo: {
        type: String
    },
      user: {
        type: Schema.Types.ObjectId,
        ref:'users',
    },
    versionkey:false,
    virsuals:true,
    collection : 'stores',
  
  
   

});

Schema.virsual("id").get(function(){
   return this._id.toHexString;
});
const stores = mongoose.model('Store',StoreSchema);

module.exports = stores ;
