import { FaShoppingBag   } from "react-icons/fa";
import { Link } from "react-router-dom";
import { GiClothes,GiConverseShoe ,GiDelicatePerfume} from "react-icons/gi";
import { LiaToolsSolid } from "react-icons/lia";
import { LuSofa } from "react-icons/lu";
import { PiBooksBold } from "react-icons/pi";
import { RiFilePaper2Line } from "react-icons/ri";
import { TbHorseToy, TbToolsKitchen3} from "react-icons/tb";
import { MdOutlineCleaningServices , MdOutlineSportsBasketball, MdOutlineMicrowave} from "react-icons/md";

import "./Categorias.css"

export default function Categorias (){
    return(
        <div className="categorias">
            <Link to="/Pesquisa?cat=Brinquedos" className="categoria">
                <TbHorseToy/>
                <p className="titulo-categoria">Brinquedos</p>
            </Link>
            <Link to="/Pesquisa?cat=Cosméticos" className="categoria">
                <GiDelicatePerfume />
                <p className="titulo-categoria">Cosméticos</p>
            </Link>
            <Link to="/Pesquisa?cat=Esportes" className="categoria">
                <MdOutlineSportsBasketball />
                <p className="titulo-categoria">Esportes</p>
            </Link>
            <Link to="/Pesquisa?cat=Roupas" className="categoria">
                <GiClothes />
                <p className="titulo-categoria">Roupas</p>
            </Link>
            <Link to="/Pesquisa?cat=Eletrônicos" className="categoria">
                <MdOutlineMicrowave/>
                <p className="titulo-categoria">Eletrônicos</p>
            </Link>
            <Link to="/Pesquisa?cat=Papelaria" className="categoria">
                <RiFilePaper2Line />
                <p className="titulo-categoria">Papelaria</p>
            </Link>
            <Link to="/Pesquisa?cat=Bolsas" className="categoria">
                <FaShoppingBag  />
                <p className="titulo-categoria">Bolsas</p>
            </Link>
            <Link to="/Pesquisa?cat=Calçados" className="categoria">
                <GiConverseShoe />
                <p className="titulo-categoria">Calçados</p>
            </Link>
            <Link to="/Pesquisa?cat=Cozinha" className="categoria">
                <TbToolsKitchen3  />
                <p className="titulo-categoria">Cozinha</p>
            </Link>
            <Link to="/Pesquisa?cat=Móveis" className="categoria">
                <LuSofa />
                <p className="titulo-categoria">Móveis</p>
            </Link>
            <Link to="/Pesquisa?cat=Ferramentas" className="categoria">
                <LiaToolsSolid />
                <p className="titulo-categoria">Ferramentas</p>
            </Link>
            <Link to="/Pesquisa?cat=Limpeza" className="categoria">
                <MdOutlineCleaningServices />
                <p className="titulo-categoria">Limpeza</p>
            </Link>
            <Link to="/Pesquisa?cat=Livros" className="categoria">
                <PiBooksBold  />
                <p className="titulo-categoria">Livros</p>
            </Link>
        </div>
    )
}