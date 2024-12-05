import React from 'react'

const Orders = () => {
  return (
      <div className="md:w-3/3 p-4">
        {/* Sección de Historial de Compras Hardcodeado*/}
    <h1 className="text-4xl md:text-6xl mb-4 text-[#e5ded3]">Historial de compras</h1>
    {/* Producto 1 */}
    <div className="py-10">
      <div className="flex mb-4">
        <img
          src="https://placehold.co/100x100"
          alt="Remera estampada shakira"
          className="w-32 h-32 mr-5"
        />
        <div>
          <h2 className="text-xl">
            <a href="#" className="underline">
              Remera estampada shakira
            </a>
          </h2>
          <p>Pendiente de envío</p>
          <p>Remera estampa personalizada</p>
        </div>
      </div>
      {/* Producto 2 */}
      <div className="flex mb-4">
        <img
          src="https://placehold.co/100x100"
          alt="Remera estampada negra"
          className="w-32 h-32 mr-5"
        />
        <div>
          <h2 className="text-xl">
            <a href="#" className="underline">
              Remera estampada negra
            </a>
          </h2>
          <p>Entregado</p>
          <p>Remera estampa personalizada</p>
        </div>
      </div>
      {/* Producto 3 */}
      <div className="flex mb-4">
        <img
          src="https://placehold.co/100x100"
          alt="Remera estampada shakira"
          className="w-32 h-32 mr-5"
        />
        <div>
          <h2 className="text-xl">
            <a href="#" className="underline">
              Remera estampada shakira
            </a>
          </h2>
          <p>Entregado</p>
          <p>Remera estampa personalizada</p>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Orders
