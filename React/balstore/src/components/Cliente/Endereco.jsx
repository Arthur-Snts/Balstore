import { useState } from "react";
import Modal from "../Auxiliares/Modal"
import "./Endereco.css"
import "../Cores.css"


export default function Endereco({enderecos}){
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenExcluir, setIsOpenExcluir] = useState(false);
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [enderecoSelecionado, setEnderecoSelecionado] = useState(null);
    
    const abrirModalEditar = (endereco) => {
    setEnderecoSelecionado(endereco);
    setIsOpenEdit(true);
};

    const abrirModalExcluir = (endereco) => {
        setEnderecoSelecionado(endereco);
        setIsOpenExcluir(true);
    };
    
    return(

        <div className="divona">

            {/* Modal Adicionar */}
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <h3>Adicionar Endereço</h3>
                <input type="text" name="rua" placeholder="Rua" className="rua" />
                <div className="linha">
                    <input type="text" name="bairro" placeholder="Bairro"  />
                    <input type="text" name="numero" placeholder="Nº" />
                </div>
                <div className="linha">
                    <input type="text" name="estado" placeholder="UF" style={{width:"60px"}} />
                    <input type="text" name="cidade" placeholder="Cidade" />
                    <input type="text" name="CEP" placeholder="CEP" />
                </div>
                <div className="buttons-modal">
                    <button className="confirm-button" onClick={() => setIsOpen(false)}>Cancelar</button>
                    <button className="cancel-button" >Confirmar</button>
                </div> 
            </Modal>

            {/* Modal Editar */}
            <Modal isOpen={isOpenEdit} onClose={() => setIsOpenEdit(false)}>
                <h3>Editar Endereço</h3>

                <input
                    type="text"
                    name="rua"
                    placeholder="Rua"
                    className="rua"
                    defaultValue={enderecoSelecionado.rua}
                />

                <div className="linha">
                    <input
                        type="text"
                        name="bairro"
                        placeholder="Bairro"
                        defaultValue={enderecoSelecionado.bairro}
                    />
                    <input
                        type="text"
                        name="numero"
                        placeholder="Nº"
                        defaultValue={enderecoSelecionado.numero}
                    />
                </div>

                <div className="linha">
                    <input
                        type="text"
                        name="estado"
                        placeholder="UF"
                        style={{width:"60px"}}
                        defaultValue={enderecoSelecionado.uf}
                    />
                    <input
                        type="text"
                        name="cidade"
                        placeholder="Cidade"
                        defaultValue={enderecoSelecionado.cidade}
                    />
                    <input
                        type="text"
                        name="CEP"
                        placeholder="CEP"
                        defaultValue={enderecoSelecionado.cep}
                    />
                </div>

                <div className="buttons-modal">
                    <button className="confirm-button" onClick={() => setIsOpenEdit(false)}>Cancelar</button>
                    <button className="cancel-button">Salvar</button>
                </div>
            </Modal>

            {/* Modal Excluir */}
            <Modal isOpen={isOpenExcluir} onClose={() => setIsOpenExcluir(false)}>
                <h3>Excluir Endereço</h3>
                <p className="confirma-excluir-endereco">Tem certeza que deseja excluir o endereço:
                {enderecoSelecionado && (
                    <p>
                        <strong>{enderecoSelecionado.rua}, {enderecoSelecionado.numero}</strong><br/>
                        {enderecoSelecionado.bairro} – {enderecoSelecionado.cidade}/{enderecoSelecionado.uf} - {enderecoSelecionado.cep}
                    </p>
                )}
                </p>
                <div className="buttons-modal">
                    <button className="confirm-button" onClick={() => setIsOpenExcluir(false)}>Cancelar</button>
                    <button className="cancel-button" >Confirmar</button>
                </div>
            </Modal>

            <button onClick={() => setIsOpen(true)} className="btn-add"> Adicionar Endereço <i className="fa fa-plus"></i></button>
            <div className="enderecos-lista">
                {enderecos.map((endereco, index)=> (
                    <div key={index} className="endereco-card">
                        <p><strong>Rua:</strong> {endereco.rua}, <strong>Nº:</strong> {endereco.numero}</p>
                        <p><strong>Bairro:</strong> {endereco.bairro}</p>
                        <p><strong>Cidade:</strong> {endereco.cidade} - <strong>UF:</strong> {endereco.uf}</p>
                        <p><strong>CEP:</strong> {endereco.cep}</p>
                        <div className="endereco-card-buttons">
                            <a onClick={() => abrirModalEditar(endereco)} className="edit-button"><i className="fa fa-edit"></i></a>
                            <a onClick={() => abrirModalExcluir(endereco)} className="delete-button"><i className="fa fa-trash"></i></a>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}