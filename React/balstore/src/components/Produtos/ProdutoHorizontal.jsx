import "./ProdutoHorizontal.css"
import "../Cores.css"


export default function ProdutoHorizontal({props, children}) {




    return(
        <>
            <div className="produto">
                <div className="left_produto">
                    <img src={props.img_path} className="img_produto"/>
                </div>
                <div className="conteudo_produto">
                    <div className="texto">
                        
                        <div className="center_produto">
                            {props.nome && <p>{props.nome}</p>}
                            {props.estoque && <p className="estoque">Estoque: {props.estoque} exemplares</p>}
                            {props.qnt && <p>Quantidades: {props.qnt}</p>}
                            {props.cliente && <p>Cliente: {props.cliente}</p>}
                            {props.exemplares && <p>{props.exemplares}</p>}
                            {props.frete && <p>{props.frete}</p>}
                            {props.pedido_realizado && <p>Pedido Realizado em: {props.pedido_realizado}</p>}
                            {props.enviado_para && <p>Enviado para: {props.enviado_para}</p>}
                        </div>
                    
                        <div className="right_produto">
                            {props.preco_desconto && <p className="descontado">R$ {props.preco_desconto}</p>}
                            {props.preco && <p className="preco">R$ {props.preco}</p>}
                            {(props.desconto || props.desconto == 0) && <p className="desconto_aplicado">Desconto Aplicado: {props.desconto} %</p>}
                        </div>
                    </div>
                    <div className="children">
                        {children}
                    </div>
                </div>
                
            </div>

        </>
    )
}