import { useEffect, useState } from "react";
import { getMenus } from "../../api/menuApi";
import { addCartItem } from "../../api/cartApi";
import { useNavigate } from "react-router-dom";

function MenuList() {

  const [menus, setMenus] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    fetchMenus();
  }, []);



  const fetchMenus = async () => {

    try {

      const response = await getMenus();

      console.log(response.data.menu);

      setMenus(response.data.menu);

    } catch (error) {

      console.log(error);
      alert("Failed to load menu");

    }

  };



  const addToCart = async (menu) => {

    console.log("Adding to cart:", menu);


    try {

      const userId = localStorage.getItem("userId");


      const response = await addCartItem({

        user: userId,

        menu: menu.id,

        quantity: 1

      });


      console.log("Cart response:", response.data);


      const viewCart = window.confirm(
        "Item added to cart! View Cart"
      );


      if (viewCart) {

        navigate("/cart");

      }


    } catch (error) {

      console.log(error);

      alert("Failed to add item");

    }

  };



  const renderCategory = (title, items) => (

    <>

      <h2 className="category-title">
        {title}
      </h2>


      <div className="menu-list-grid">

        {items.map((menu) => (

          <div
            className="menu-list-card"
            key={menu.id}
          >


            {menu.image && (

              <img
                src={`http://127.0.0.1:8000${menu.image}`}
                alt={menu.name}
                className="menu-image"
                onClick={() => navigate(`/menu/${menu.id}`)}
              />

            )}



            <h3>
              {menu.name}
            </h3>


            <p>
              {menu.description}
            </p>


            <h4>
              ₹{menu.price}
            </h4>



            <button
              type="button"
              onClick={() => addToCart(menu)}
            >
              Add to Cart
            </button>



            {/* <button
              type="button"
              onClick={() => navigate(`/menu/${menu.id}`)}
            >
              View Details
            </button> */}


          </div>

        ))}

      </div>

    </>

  );



  const starters = menus.filter(
    menu => menu.category === "Starter"
  );


  const mainCourses = menus.filter(
    menu => menu.category === "Main Course"
  );


  const desserts = menus.filter(
    menu => menu.category === "Dessert"
  );


  const beverages = menus.filter(
    menu => menu.category === "Beverage"
  );



  return (

    <div className="menu-list-container">


      {renderCategory("Starters", starters)}

      <br />
      <hr />
      <br />


      {renderCategory("Main Course", mainCourses)}

      <br />
      <hr />
      <br />


      {renderCategory("Desserts", desserts)}

      <br />
      <hr />
      <br />


      {renderCategory("Beverages", beverages)}


    </div>

  );

}


export default MenuList;