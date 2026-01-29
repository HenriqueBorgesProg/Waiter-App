import { FlatList, TouchableOpacity } from "react-native";
import { useState } from "react";
import { CartItem } from "../../types/CartItem";

import { Text } from "../Text";
import { formatCurrency } from "../../utils/formatCurrency";
import { Button } from "../Button";
import { Product } from "../../types/product";

import { PlusCircle } from "../Icons/PlusCircle";
import { MinusCircle } from "../Icons/MinusCircle";

import {
  Item,
  ProductContainer,
  Actions,
  Image,
  QuantityContainer,
  ProductDetails,
  Summary,
  TotalContainer,
} from "./style";
import { OrderConfirmedModal } from "../OrderConfirmedModal";
import { api } from "../../utils/api";

interface CartProps {
  cartItems: CartItem[];
  onAdd: (product: Product) => void;
  onDecrement: (product: Product) => void;
  onConfirmOrder: () => void;
  selectedTable: string;
}

export function Cart({ cartItems, onAdd, onDecrement, onConfirmOrder, selectedTable }: CartProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const total = cartItems.reduce((acc, cartItem) => {
    return acc + cartItem.product.price * cartItem.quantity;
  }, 0)

  async function handleConfirmOrder() {
    setIsLoading(true);
    const payload = {
      table: selectedTable,
      products: cartItems.map((cartItem) => ({
        product: cartItem.product._id,
        quantity: cartItem.quantity,
      }))
    }
    await api.post('/orders', payload);
    setIsLoading(false);
    setIsModalVisible(true);
  }

  function handleOk() {
    onConfirmOrder();
    setIsModalVisible(false);
  }

  return (
    <>

    <OrderConfirmedModal
     visible={isModalVisible}
     onOk={handleOk}
    />

      <FlatList
        data={cartItems}
        keyExtractor={(cartItem) => cartItem.product._id}
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 20, maxHeight: 150 }}
        renderItem={({ item: cartItem }) => (
          <Item>
            <ProductContainer>
              <Image
                source={{
                  uri: `http://192.168.1.94:3001/uploads/${cartItem.product.imagePath}`,
                }}
              />
              <QuantityContainer>
                <Text size={14} color="#666">
                  {cartItem.quantity}x
                </Text>
              </QuantityContainer>
              <ProductDetails>
                <Text weight="600" size={14}>
                  {cartItem.product.name}
                </Text>
                <Text size={14} color="#666">
                  {formatCurrency(cartItem.product.price)}
                </Text>
              </ProductDetails>
            </ProductContainer>
            <Actions>
              <TouchableOpacity
              style={{ marginRight: 24 }}
              onPress={() => onAdd(cartItem.product)}
              >
                <PlusCircle />
              </TouchableOpacity>
              <TouchableOpacity
              onPress={() => onDecrement(cartItem.product)}
              >
                <MinusCircle />
              </TouchableOpacity>
            </Actions>
          </Item>
        )}
      />
      <Summary>
        <TotalContainer>
          {cartItems.length > 0 ? (
            <>
              <Text color="#666">Total</Text>
              <Text size={20} weight="600">
                {formatCurrency(total)}
              </Text>
            </>
          ) : (
            <Text color="#666">Seu carrinho está vazio</Text>
          )}
        </TotalContainer>

        <Button onPress={handleConfirmOrder}
          disabled={cartItems.length === 0}
          loading={isLoading}
          >
          Confirmar pedido
        </Button>
      </Summary>
    </>
  );
}
