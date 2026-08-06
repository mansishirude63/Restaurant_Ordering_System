import { useEffect, useState } from "react";
import {
  getAllOrders,
  getUserOrders
} from "../../api/ordersApi";
import { useNavigate } from "react-router-dom";


function OrderList() {

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);



  useEffect(() => {

    fetchOrders();

  }, []);




  const fetchOrders = async () => {


    try {


      const user = JSON.parse(
        localStorage.getItem("user")
      );


      let response;



      if (
        user.status === "Admin" ||
        user.status === "Staff"
      ) {

        // staff/admin see all orders

        response = await getAllOrders();


      }
      else {


        // customer sees own orders

        response = await getUserOrders(
          user.id
        );


      }




      setOrders(
        response.data.orders
      );



    }

    catch (error) {

      console.log(error);

      alert("Failed to load orders");

    }


  };





  return (

    <div className="order-container">

      <button
        className="backBtn"
        onClick={() => navigate(-1)}
      >
        ←
      </button>

      <h2>
        {
          JSON.parse(localStorage.getItem("user"))
            ?.status === "Customer"

            ? "My Orders"

            : "All Orders"
        }

      </h2>




      <table>


        <thead>

          <tr>

            <th>
              Order ID
            </th>


            <th>
              User
            </th>


            <th>
              Total
            </th>


            <th>
              Status
            </th>


            <th>
              Date
            </th>


          </tr>


        </thead>





        <tbody>


          {

            orders.length > 0 ?


              orders.map(order => (


                <tr key={order.id}>


                  <td>
                    #{order.id}
                  </td>



                  <td>
                    {order.user}
                  </td>




                  <td>
                    ₹{order.total_price}
                  </td>




                  <td>
                    <span
                      className={
                        order.status === "Pending"
                          ? "status-pending"
                          : order.status === "Preparing"
                            ? "status-preparing"
                            : "status-delivered"
                      }
                    >
                      {order.status}
                    </span>
                  </td>


                  <td>
                    {
                      new Date(
                        order.order_date
                      ).toLocaleDateString()
                    }
                  </td>

                  <button onClick={() => navigate(`/order-details/${order.id}`)} className="view-order-btn">
                    View Details
                  </button>


                </tr>


              ))


              :


              <tr>

                <td colSpan="5">
                  No Orders Found
                </td>

              </tr>


          }


        </tbody>



      </table>


    </div>

  );


}


export default OrderList;