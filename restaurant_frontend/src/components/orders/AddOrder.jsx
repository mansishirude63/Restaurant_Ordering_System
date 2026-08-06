import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCartItems } from "../../api/cartApi";
import { placeOrder } from "../../api/ordersApi";
import { getUser, updateUser } from "../../api/accountApi";



function AddOrder() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [cartItems, setCartItems] = useState([]);

  const [hasAddress, setHasAddress] = useState(false);


  const [addressData, setAddressData] = useState({
    full_name: "",
    phone_number: "",
    house_no: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });



  useEffect(() => {

    fetchCart();
    fetchUserAddress();

  }, []);



  // Fetch Cart
  const fetchCart = async () => {

    try {

      const userId = localStorage.getItem("userId");

      const response = await getCartItems(userId);

      setCartItems(response.data);

    } 
    catch (error) {

      console.log(error);
      alert("Failed to load cart");

    }

  };





  // Fetch User Address
 const fetchUserAddress = async () => {

  try {

    const userId = localStorage.getItem("userId");

    const response = await getUser(userId);

    console.log("USER RESPONSE:", response.data);


    const userData = response.data.user || response.data;


    setUser(userData);


    if (userData.address && userData.address.trim() !== "") {

      console.log("Address found");

      setHasAddress(true);

      setAddressData({
        full_name: userData.address,
        phone_number: "",
        house_no: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
      });

    } 
    
    else {

      console.log("No address found");

      setHasAddress(false);

    }


  } catch(error) {

    console.log(error);

  }

};



  // Input Change
  const handleChange = (e)=>{

    setAddressData({

      ...addressData,

      [e.target.name]: e.target.value

    });

  };






  // Total Price
  const total = cartItems.reduce(

    (sum,item)=> sum + Number(item.total_price),

    0

  );






  // Confirm Order
  const confirmOrder = async()=>{


    const userId = localStorage.getItem("userId");


    let fullAddress;



    if(hasAddress){

      fullAddress = addressData.full_name;


    }

    else{


      if(
        !addressData.full_name ||
        !addressData.phone_number ||
        !addressData.house_no ||
        !addressData.street ||
        !addressData.city ||
        !addressData.state ||
        !addressData.pincode
      ){

        alert("Please fill all address details");

        return;

      }



      fullAddress = `
      ${addressData.full_name},
      ${addressData.phone_number},
      ${addressData.house_no},
      ${addressData.street},
      ${addressData.city},
      ${addressData.state},
      ${addressData.pincode}
      `;



      // Save address
      await updateUser(userId,{

        address: fullAddress

      });


    }





    try{


      const response = await placeOrder({

        user:userId,

        total_price:total,

        address:fullAddress

      });



      const orderId = response.data.order.id;


      navigate(`/payment/${orderId}`);



    }
    catch(error){

      console.log(error);

      alert("Order failed");

    }


  };






  return (

    <div className="place-order-container">


      <h2>Checkout</h2>




      <div className="checkout-container">



        {/* LEFT SIDE */}

        <div className="checkout-left">


          <h3>Order Summary</h3>



          {
            cartItems.map((item)=>(


              <div className="order-card" key={item.id}>


                <img

                  src={item.menu_image}

                  alt={item.menu_name}

                />


                <div>


                  <h4>{item.menu_name}</h4>


                  <p>
                    Price : ₹{item.menu_price}
                  </p>


                  <p>
                    Quantity : {item.quantity}
                  </p>


                  <p>
                    Total : ₹{item.total_price}
                  </p>


                </div>


              </div>


            ))
          }



          <h2 className="order-total">

            Grand Total : ₹{total}

          </h2>


        </div>







        {/* RIGHT SIDE */}

        <div className="checkout-right">



          {
            hasAddress ? (



              <div className="saved-address">


                <h3>Delivery Address</h3>


                <p>

                  {addressData.full_name}

                </p>



              </div>



            )

            :

            (


              <div className="address-form">


                <h3>Enter Delivery Address</h3>



                <input

                  name="full_name"

                  placeholder="Full Name"

                  value={addressData.full_name}

                  onChange={handleChange}

                />



                <input

                  name="phone_number"

                  placeholder="Phone Number"

                  value={addressData.phone_number}

                  onChange={handleChange}

                />



                <input

                  name="house_no"

                  placeholder="House No"

                  value={addressData.house_no}

                  onChange={handleChange}

                />



                <input

                  name="street"

                  placeholder="Street"

                  value={addressData.street}

                  onChange={handleChange}

                />



                <input

                  name="city"

                  placeholder="City"

                  value={addressData.city}

                  onChange={handleChange}

                />



                <input

                  name="state"

                  placeholder="State"

                  value={addressData.state}

                  onChange={handleChange}

                />



                <input

                  name="pincode"

                  placeholder="Pincode"

                  value={addressData.pincode}

                  onChange={handleChange}

                />


              </div>


            )

          }






          <button

            className="confirm-order-btn"

            onClick={confirmOrder}

          >

            Continue to Payment

          </button>



        </div>



      </div>


    </div>

  );

}


export default AddOrder;