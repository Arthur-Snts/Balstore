import "./ProdutoHorizontal.css"
import "../Cores.css"


export default function ProdutoHorizontal({props, children}) {

    return(
        <>
            <div className="produto">
                <div className="left_produto">
                    <img src={props.imagem_path} alt={props.nome} className="img_produto"/>
                </div>
                <div className="conteudo_produto">
                    <div className="texto">
                        <div className="center_produto">
                            {props.nome && <p className="nome-produto-horizontal">{props.nome}</p>}
                            {props.estoque && <p className="estoque">Estoque: {props.estoque} exemplares</p>}
                            {props.qnt && <p style={{marginBottom:0}} className="quantidade">Quantidades: {props.qnt}</p>}
                            {props.cliente && <p style={{marginBottom:"40px"}}>Cliente: {props.cliente}</p>}
                            {props.exemplares && <p>{props.exemplares}</p>}
                            {props.frete && <p>{props.frete}</p>}
                            {props.pedido_realizado && <p>Pedido Realizado em: {props.pedido_realizado}</p>}
                            {props.enviado_para && <p>Enviado para: {props.enviado_para}</p>}
                        </div>
                    
                        <div className="right_produto">
                            {props.preco && props.promocao > 0 && (
                                <p className="descontado">R$ {props.preco.toFixed(2)}</p>
                            )}
                            {props.preco && (
                                <p className="preco">
                                R$ {Number((
                                    props.promocao > 0
                                    ? props.preco - (props.preco * props.promocao) / 100
                                    : props.preco
                                )).toFixed(2)}
                                </p>
                            )}
                            {(props.promocao || props.promocao === 0) && (
                                <p className="desconto_aplicado">
                                Desconto Aplicado: {props.promocao} %
                                </p>
                            )}
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