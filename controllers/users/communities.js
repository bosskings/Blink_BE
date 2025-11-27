import CommunityModel from "../../models/Community.js";
import UserModel from "../../models/User.js";

const communitiesNear = async (req, res)=>{

    try {
        
        // 1. Get user's coordinates from query parameters
        const { lng, lat, maxDistanceKm = 10 } = req.query;
        
        // Input validation and conversion
        const userLat = parseFloat(lat);
        const userLng = parseFloat(lng);
        const maxDistanceMeters = parseFloat(maxDistanceKm) * 1000; // Convert km to meters
        
        if (isNaN(userLat) || isNaN(userLng)) {
            throw new Error("Invalid coordinates provided");
        }


        // 2. Execute the Geospatial Aggregation Pipeline
        const nearestCommunities = await CommunityModel.aggregate([
            {
                // $geoNear MUST be the first stage in the pipeline
                $geoNear: {
                    near: { 
                        type: 'Point', 
                        // CRITICAL: User's coordinates MUST be in [Longitude, Latitude] order
                        coordinates: [userLng, userLat] 
                    },
                    distanceField: 'distance_meters', // Field to store the distance
                    maxDistance: maxDistanceMeters,   // Search radius (e.g., 10,000 meters)
                    spherical: true,                  // Calculate distance on a sphere (Earth)
                }
            },
            {
                // $project: Format the output data
                $project: {
                    _id: 1,
                    name: 1,
                    city: 1,
                    // Convert meters to kilometers for easy display on the frontend
                    distance_km: { $round: [{ $divide: ['$distance_meters', 1000] }, 2] },
                    
                    // Optionally include the institution's coordinates
                    institution_lat: { $arrayElemAt: ['$location.coordinates', 1] }, 
                    institution_lng: { $arrayElemAt: ['$location.coordinates', 0] }
                }
            },
            {
                // $limit: Only return the top 5 closest results
                $limit: 5 
            }
            
        ])

        if (nearestCommunities.length === 0) {
            throw new Error("No institutions found within the specified radius");
        }

        res.json({ 
            status:"SUCCESS",
            data: nearestCommunities
        });

    } catch (error) {
        return res.status(500).json({
            status:"FAILED", 
            message:"an error occurred: "+error
        })
    }



}



const selectCommunities = async (req, res) => {
    try {
        const userId = req.body.user_id;
        const { selectedCommunities } = req.body; // Array of community _ids

        if (!userId) {
            
            throw new Error("User ID not provided");
            
        }

        if (!Array.isArray(selectedCommunities) || selectedCommunities.length === 0) {
            
            throw new Error("No communities selected");
            
        }

        // Find user
        const user = await UserModel.findById(userId);
        if (!user) {
            
            throw new Error("User not found");
            
        }

        // Store selected communities' _ids
        user.communities = selectedCommunities;
        await user.save();

        return res.status(200).json({
            status: "SUCCESS",
            data: user.communities
        });

    } catch (error) {
        return res.status(500).json({
            status: "FAILED",
            message: "an error occurred: " + error
        });
    }
}












export {
    communitiesNear,
    selectCommunities
};