"use client"
import OrderList from "@/components/Dashboard/OrderList"
import { IUserSession } from "@/interfaces"
// import Cookies from "js-cookie"
import React from "react"

const Orders = () => {
  // const userData: IUserSession = JSON.parse(Cookies.get("userData") || "{}")

  return (
    <div>
       {/* <OrderList userToken={userData?.token} /> */}
    </div>
  )
}

export default Orders