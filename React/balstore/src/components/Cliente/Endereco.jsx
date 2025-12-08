import { useState, useEffect } from "react";
import Modal from "../Auxiliares/Modal"
import "./Endereco.css"
import "../Cores.css"

import { deleteendereco, postendereco, putendereco, verificar_token_cliente } from "../../statements"
import { useAlert } from "../Auxiliares/AlertContext";
import Loading from "../../pages/Loading"
import { useNavigate } from "react-router-dom"


export default function Endereco(){


    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null)
    const [loading, setLoading] = useState(true)
    const { showAlert } = useAlert();

    useEffect(() => {
            async function carregarUsuario() {
                let token = localStorage.getItem("token");
                if (token){
                    const user_devolvido = await verificar_token_cliente(navigate);
                    
                    setCliente(user_devolvido);
                }
                    else{
                        showAlert(`Você precisa estar conectado como Cliente para acessar essa página` , "info");
                        navigate("/Login") 
                    }
                setLoading(false)
            }
            carregarUsuario();
            
            
        }, []);
    
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

    const [rua, setRua] = useState("")
    const [bairro, setBairro] = useState("")
    const [numero, setNumero] = useState("")
    const [uf, setUF] = useState("")
    const [cidade, setCidade] = useState("")
    const [CEP, setCEP] = useState("")

    async function handleAdicionar (e) {
        e.preventDefault();
        const enderecoEnviarCorrigido = {
            rua: rua,
            bairro: bairro,
            numero: numero,
            estado: uf,
            cidade: cidade,
            CEP: CEP,
            cli_id: cliente.id
        };
        const resultado = await postendereco(enderecoEnviarCorrigido);

        if (resultado.success) {
            showAlert("Endereço criado com sucesso!", "success");
            setCliente(prev => ({
                ...prev,
                enderecos: [
                    ...prev.enderecos,
                    resultado.endereco
                ]
            }));
        } else {
            showAlert(resultado.status, "erro");
        }
        setIsOpen(false)
      }

      async function handleEditar (e) {
        e.preventDefault();
        
        const resultado = await putendereco(enderecoSelecionado);

        if (resultado.success) {
            showAlert("Endereço editado com sucesso!", "success");
            setCliente(prev => ({
                ...prev,
                enderecos: [
                    // remove o antigo
                    ...prev.enderecos.filter(f => f.id !== enderecoSelecionado.id),

                    // adiciona o novo
                    enderecoSelecionado
                ]
            }));
        } else {
            showAlert(resultado.status, "erro");
        }
        setIsOpenEdit(false)
      }

      async function handleDelete (e) {
        e.preventDefault();
        
        const resultado = await deleteendereco(enderecoSelecionado.id);

        if (resultado.success) {
            showAlert("Endereço Excluido com sucesso!", "success");
            setCliente(prev => ({
                ...prev,
                enderecos: [
                    // remove o antigo
                    ...prev.enderecos.filter(f => f.id !== enderecoSelecionado.id),
                ]
            }));
        } else {
            showAlert(resultado.status, "erro");
        }
        setIsOpenExcluir(false)
      }
    
    return(
        <>{loading? <Loading/>: 
        <div className="divona">

            {/* Modal Adicionar */}
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <h3>Adicionar Endereço</h3>
                <div className="linha">
                    <div className="input-container">
                        <input 
                            id="rua"
                            type="text" 
                            name="rua" 
                            placeholder="" 
                            className="input-field" 
                            value={rua} 
                            onChange={(e)=>setRua(e.target.value)}
                        />
                        <label for="rua" className="input-label">Rua</label>
                    </div>
                </div>
                <div className="linha">
                    <div className="input-container">
                        <input 
                            id="bairro"
                            type="text" 
                            name="bairro" 
                            placeholder=""
                            className="input-field"
                            value={bairro} 
                            onChange={(e)=>setBairro(e.target.value)}
                        />
                        <label for="bairro" className="input-label">Bairro</label>
                    </div>
                    <div className="input-container">
                        <input 
                        id="numero" 
                        type="text" 
                        name="numero" 
                        placeholder="" 
                        className="input-field"
                        value={numero} 
                        onChange={(e)=>setNumero(e.target.value)}
                        />
                        <label for="numero" className="input-label">Nº</label>
                    </div>
                </div>
                <div className="linha">
                    <div className="input-container">
                        <input 
                        id="UF"
                        type="text" 
                        name="estado" 
                        placeholder=""
                        className="input-field" 
                        value={uf} 
                        onChange={(e)=>setUF(e.target.value)}
                        />
                        <label for="UF" className="input-label">UF</label>
                    </div>
                    <div className="input-container">
                        <input 
                        id="cidade"
                        type="text" 
                        name="cidade" 
                        placeholder="" 
                        className="input-field"
                        value={cidade} 
                        onChange={(e)=>setCidade(e.target.value)}
                        />
                        <label for="cidade" className="input-label">Cidade</label>
                    </div>
                    <div className="input-container">
                        <input 
                        id="CEP"
                        type="text" 
                        name="CEP" 
                        placeholder="" 
                        className="input-field"
                        value={CEP} 
                        onChange={(e)=>setCEP(e.target.value)}
                        />
                        <label for="CEP" className="input-label">CEP</label>
                    </div>
                </div>
                <div className="buttons-modal">
                    <button className="confirm-endereco" onClick={() => setIsOpen(false)}>Cancelar</button>
                    <button className="cancel-endereco" onClick={handleAdicionar}>Confirmar</button>
                </div> 
            </Modal>

            {/* Modal Editar */}
            <Modal isOpen={isOpenEdit} onClose={() => setIsOpenEdit(false)}>
                <h3>Editar Endereço</h3>
                <div className="linha">
                    <div className="input-container">
                        <input 
                            id="rua"
                            type="text" 
                            name="rua" 
                            placeholder="" 
                            className="input-field" 
                            defaultValue={enderecoSelecionado?.rua}
                            onChange={(e) =>setEnderecoSelecionado(prev=>({...prev, rua: e.target.value}))}
                        />
                        <label for="rua" className="input-label">Rua</label>
                    </div>
                </div>
                <div className="linha">
                    <div className="input-container">
                        <input 
                            id="bairro"
                            type="text" 
                            name="bairro" 
                            placeholder=""
                            className="input-field"
                             defaultValue={enderecoSelecionado?.bairro}
                            onChange={(e) =>setEnderecoSelecionado(prev=>({...prev, bairro: e.target.value}))}
                        />
                        <label for="bairro" className="input-label">Bairro</label>
                    </div>
                    <div className="input-container">
                        <input 
                        id="numero" 
                        type="text" 
                        name="numero" 
                        placeholder="" 
                        className="input-field"
                        defaultValue={enderecoSelecionado?.numero}
                        onChange={(e) =>setEnderecoSelecionado(prev=>({...prev, numero: e.target.value}))}
                        />
                        <label for="numero" className="input-label">Nº</label>
                    </div>
                </div>
                <div className="linha">
                    <div className="input-container">
                        <input 
                        id="UF"
                        type="text" 
                        name="estado" 
                        placeholder=""
                        className="input-field" 
                        defaultValue={enderecoSelecionado?.estado}
                        onChange={(e) =>setEnderecoSelecionado(prev=>({...prev, estado: e.target.value}))}
                        />
                        <label for="UF" className="input-label">UF</label>
                    </div>
                    <div className="input-container">
                        <input 
                        id="cidade"
                        type="text" 
                        name="cidade" 
                        placeholder="" 
                        className="input-field"
                        defaultValue={enderecoSelecionado?.cidade}
                        onChange={(e) =>setEnderecoSelecionado(prev=>({...prev, estado: e.target.value}))}
                        />
                        <label for="cidade" className="input-label">Cidade</label>
                    </div>
                    <div className="input-container">
                        <input 
                        id="CEP"
                        type="text" 
                        name="CEP" 
                        placeholder="" 
                        className="input-field"
                        defaultValue={enderecoSelecionado?.CEP}
                        onChange={(e) =>setEnderecoSelecionado(prev=>({...prev, CEP: e.target.value}))}
                        />
                        <label for="CEP" className="input-label">CEP</label>
                    </div>
                </div>

                <div className="buttons-modal">
                    <button className="confirm-button" onClick={() => setIsOpenEdit(false)}>Cancelar</button>
                    <button className="cancel-button" onClick={handleEditar}>Salvar</button>
                </div>
            </Modal>

            {/* Modal Excluir */}
            <Modal isOpen={isOpenExcluir} onClose={() => setIsOpenExcluir(false)}>
                <h3>Excluir Endereço</h3>
                <p className="confirma-excluir-endereco">Tem certeza que deseja excluir o endereço:
                {enderecoSelecionado && (
                    <p>
                        <strong>{enderecoSelecionado.rua}, {enderecoSelecionado.numero}</strong><br/>
                        <strong>{enderecoSelecionado.bairro} – {enderecoSelecionado.cidade}/{enderecoSelecionado.estado} - {enderecoSelecionado.CEP}</strong>
                    </p>
                )}
                </p>
                <div className="buttons-modal">
                    <button className="confirm-excluir-button" onClick={() => setIsOpenExcluir(false)}>Cancelar</button>
                    <button className="cancel-excluir-button" onClick={handleDelete}>Confirmar</button>
                </div>
            </Modal>

            <button onClick={() => setIsOpen(true)} className="btn-add"> Adicionar Endereço <i className="fa fa-plus"></i></button>
            <div className="enderecos-lista">
                {cliente?.enderecos.map((endereco, index)=> (
                    <div key={index} className="endereco-card">
                        <p><strong>Rua:</strong> {endereco?.rua}, <strong>Nº:</strong> {endereco?.numero}</p>
                        <p><strong>Bairro:</strong> {endereco?.bairro}</p>
                        <p><strong>Cidade:</strong> {endereco?.cidade} - <strong>UF:</strong> {endereco?.estado}</p>
                        <p><strong>CEP:</strong> {endereco?.CEP}</p>
                        <div className="endereco-card-buttons">
                            <a onClick={() => abrirModalEditar(endereco)} className="edit-button"><i className="fa fa-edit"></i></a>
                            <a onClick={() => abrirModalExcluir(endereco)} className="delete-button"><i className="fa fa-trash"></i></a>
                        </div>

                    </div>
                ))}
            </div>
        </div>}</>
    )
}