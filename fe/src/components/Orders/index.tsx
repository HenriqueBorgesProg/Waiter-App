import type { Order } from "../../types/Order";
import { Container } from "./styles";
import { api } from "../../utils/api";
import { OrdersBoard } from "../OrdersBoard/index";
import { useState, useEffect } from "react";
import socketIo from "socket.io-client";

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const socket = socketIo("http://localhost:3001", {
      transports: ["websocket"],
    });

    socket.on("orders@new", (order) => {
      setOrders((prevState) => {
        const orderExists = prevState.some((o) => o._id === order._id);
        if (orderExists) return prevState;
        return prevState.concat(order);
      });
    });
  }, []);

  useEffect(() => {
    api.get("/orders").then(({ data }) => {
      setOrders(data);
    });
  }, []);

  const waitingOrders = orders.filter((order) => order.status === "WAITING");
  const inProduction = orders.filter(
    (order) => order.status === "IN_PRODUCTION",
  );
  const doneOrders = orders.filter((order) => order.status === "DONE");

  function handleCancelOrder(orderId: string) {
    setOrders((prevState) =>
      prevState.filter((order) => order._id !== orderId),
    );
  }

  function handleOrderStatusChange(orderId: string, status: Order["status"]) {
    setOrders((prevState) =>
      prevState.map((order) =>
        order._id === orderId ? { ...order, status } : order,
      ),
    );
  }

  return (
    <Container>
      <OrdersBoard
        icon="⏱️"
        title="Fila de Espera"
        orders={waitingOrders}
        onCancelOrder={handleCancelOrder}
        onChangeOrderStatus={handleOrderStatusChange}
      />
      <OrdersBoard
        icon="👨🏻‍🍳"
        title="Em Preparação"
        orders={inProduction}
        onCancelOrder={handleCancelOrder}
        onChangeOrderStatus={handleOrderStatusChange}
      />
      <OrdersBoard
        icon="✅"
        title="Pronto!"
        orders={doneOrders}
        onCancelOrder={handleCancelOrder}
        onChangeOrderStatus={handleOrderStatusChange}
      />
    </Container>
  );
}
