import mongoose from "mongoose";

const menuSchema = mongoose.Schema(
  {
    restaurantID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
    dishName: {
      type: String,
      required: true,
    },
    cuisine: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["veg", "non-veg", "vegan", "egg", "jain", "spicy"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    servingsize: {
      type: String,
      required: true,
    },
    preparationTime: {
      type: String,
      required: true,
    },
    availability: {
      type: Boolean,
      required: true,
      enum:['available' , "unavailable", ],
      default: 'available',
    },
    image: {
      type: [
        {
          url: {type:String , required:true},
          publicID:{type:String , required:true},
        },
      ],
      required: true,
    },
  },
  { timestamps: true },
);

const Menu = mongoose.model("Menu" , menuSchema);
export default Menu;
