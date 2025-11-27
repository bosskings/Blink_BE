import mongoose from "mongoose";

const CommunitiesSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        trim:true
    },

    city:{
        type:String,
        default:""
    },

    location:{

        type:{
            type:String,
            default:"Point"
        },
        coordinates:{
            type:[Number],
            required:true
        }
    }



})

// to enable geospatial calculation(find nearest communities to users)
CommunitiesSchema.index({location:'2dsphere'});

const CommunityModel = mongoose.model("Communities", CommunitiesSchema, );

export default CommunityModel;