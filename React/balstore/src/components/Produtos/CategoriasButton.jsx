export default function CategoriasButton () {
    let categoria_icone = ""
    let categoria_link = ""
    let categoria_nome = ""
    return (
        <>
            <button><img src={categoria_icone} alt="" /><a href={categoria_link}></a></button>
            <label>{categoria_nome}</label>
        </>
    )

}