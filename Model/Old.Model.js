const mongoose = require("mongoose");

const OldphoneSchema = new mongoose.Schema({
 
    
        modelName: { type: String },
        returnNoDamage: { type: Number },
        bodyDamage: { type: Number },
        screenDamage:{ type: Number },
        minPrice:{ type: Number },
        maxPrice:{ type: Number },
        des:[{ type: String }],
        AppleCareMontly: { type: Number },
        ApplecareMrp:{ type: Number },
        ApplecareDes:[{ type: String }],
      
    
 
});

const OldphoneModel = mongoose.model("Old_Phone", OldphoneSchema);

module.exports = {
  OldphoneModel,
};
