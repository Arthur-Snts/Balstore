import { useState } from "react";
import Modal from "../Auxiliares/Modal"
import "./Endereco.css"
import "../Cores.css"


export default function Endereco({enderecos}){
    const [isOpen, setIsOpen] = useState(false);
    
    
    return(

        <div className="divona">

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <h3>Adicionar Endereço</h3>
                <input type="text" name="rua" placeholder="Rua"  />
                <div className="linha">
                    <input type="text" name="bairro" placeholder="Bairro"  />
                    <input type="text" name="numero" placeholder="Nº" />
                </div>
                <div className="linha">
                    <input type="text" name="estado" placeholder="UF" style={{width:"40px"}}/>
                    <input type="text" name="cidade" placeholder="Cidade" />
                    <input type="text" name="CEP" placeholder="CEP" />
                </div>
                <div className="buttons-modal">
                    <button className="confirm-button" onClick={() => setIsOpen(false)}>Cancelar</button>
                    <button className="cancel-button" >Confirmar</button>
                </div>
                
            </Modal>
            <button onClick={() => setIsOpen(true)} className="btn-add"><i className="fa fa-plus"></i> Adicionar Endereço</button>
            <div className="enderecos-lista">
                {enderecos.map((endereco, index)=> (
                    <div key={index} className="endereco-card">
                        <p><strong>Rua:</strong> {endereco.rua}, <strong>Nº:</strong> {endereco.numero}</p>
                        <p><strong>Bairro:</strong> {endereco.bairro}</p>
                        <p><strong>Cidade:</strong> {endereco.cidade} - <strong>UF:</strong> {endereco.estado}</p>
                        <p><strong>CEP:</strong> {endereco.CEP}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}