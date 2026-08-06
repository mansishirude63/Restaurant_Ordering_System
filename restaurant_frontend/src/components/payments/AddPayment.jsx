import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addPayment } from "../../api/paymentsApi";
import { getOrderById } from "../../api/ordersApi";
import SuccessPopUp from "../SuccessPopUp";


function AddPayment() {


  const { orderId } = useParams();

  const navigate = useNavigate();



  const [paymentData, setPaymentData] = useState({

    order: orderId,

    amount: "",

    payment_method: "Cash"

  });



  const [showSuccess, setShowSuccess] = useState(false);



  useEffect(() => {

    fetchOrder();

  }, []);



  const fetchOrder = async () => {

    try {

      const response = await getOrderById(orderId);


      setPaymentData({

        order: orderId,

        amount: response.data.order.total_price,

        payment_method: "Cash"

      });


    }

    catch (error) {

      console.log(error);

      alert("Failed to fetch order");

    }

  };





  const handleChange = (e) => {


    setPaymentData({

      ...paymentData,

      [e.target.name]: e.target.value

    });


  };






  const handlePayment = async (e) => {


    e.preventDefault();



    try {


      const payment = {


        order: paymentData.order,


        amount: paymentData.amount,


        payment_method: paymentData.payment_method,


        payment_status:

          paymentData.payment_method === "Cash"

            ? "Pending"

            : "Completed",


      };



      const response = await addPayment(payment);



      console.log("Payment Created:", response.data);



      // show success popup

      setShowSuccess(true);



    }


    catch (error) {


      console.log(

        error.response?.data || error.message

      );


      alert("Payment failed");


    }


  };







  return (


    <div className="payment-container">



      <h2>
        Payment
      </h2>



      <form onSubmit={handlePayment}>


        <label>
          Amount
        </label>


        <input

          type="number"

          value={paymentData.amount}

          readOnly

        />




        <label>
          Payment Method
        </label>



        <select

          name="payment_method"

          value={paymentData.payment_method}

          onChange={handleChange}

        >


          <option value="Cash">
            Cash on Delivery
          </option>


          <option value="UPI">
            UPI
          </option>


          <option value="Card">
            Card
          </option>



        </select>




        <button type="submit">

          {

            paymentData.payment_method === "Cash"

              ? "Place Order"

              : "Pay Now"

          }


        </button>



      </form>





      {

        showSuccess &&


        <SuccessPopUp


          closePopup={() => {


            setShowSuccess(false);



            navigate(`/delivery/${orderId}`);



          }}


        />


      }



    </div>


  );


}


export default AddPayment;