import api from "./api";


// Add delivery
export const addDelivery = (data) => {
    return api.post("/delivery/", data);
};



// Get all deliveries (Admin/Staff)
export const getDeliveries = () => {
    return api.get("/delivery/");
};



// Get delivery by order ID (Customer)
export const getDeliveryByOrderId = (orderId) => {

    return api.get(
        `/delivery/order/${orderId}/`
    );

};



// Update delivery status (Admin/Staff)
export const updateDelivery = (id, data) => {

    return api.put(
        `/delivery/update/${id}/`,
        data
    );

};



// Delete delivery
// Remove this if you don't have delete URL in urls.py
export const deleteDelivery = (id) => {

    return api.delete(
        `/delivery/${id}/`
    );

};


export default api;