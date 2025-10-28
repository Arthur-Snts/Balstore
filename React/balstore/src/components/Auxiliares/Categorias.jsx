import { FaShoppingBag   } from "react-icons/fa";
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
            <div className="categoria">
                <TbHorseToy/>
                <p className="titulo-categoria">Brinquedos</p>
            </div>
            <div className="categoria">
                <GiDelicatePerfume />
                <p className="titulo-categoria">Cosméticos</p>
            </div>
            <div className="categoria">
                <MdOutlineSportsBasketball />
                <p className="titulo-categoria">Esportes</p>
            </div>
            <div className="categoria">
                <GiClothes />
                <p className="titulo-categoria">Roupas</p>
            </div>
            <div className="categoria">
                <MdOutlineMicrowave/>
                <p className="titulo-categoria">Eletrônicos</p>
            </div>
            <div className="categoria">
                <RiFilePaper2Line />
                <p className="titulo-categoria">Papelaria</p>
            </div>
            <div className="categoria">
                <FaShoppingBag  />
                <p className="titulo-categoria">Bolsas</p>
            </div>
            <div className="categoria">
                <GiConverseShoe />
                <p className="titulo-categoria">Calçados</p>
            </div>
            <div className="categoria">
                <TbToolsKitchen3  />
                <p className="titulo-categoria">Cozinha</p>
            </div>
            <div className="categoria">
                <LuSofa />
                <p className="titulo-categoria">Móveis</p>
            </div>
            <div className="categoria">
                <LiaToolsSolid />
                <p className="titulo-categoria">Ferramentas</p>
            </div>
            <div className="categoria">
                <MdOutlineCleaningServices />
                <p className="titulo-categoria">Limpeza</p>
            </div>
            <div className="categoria">
                <PiBooksBold  />
                <p className="titulo-categoria">Livros</p>
            </div>
        </div>
    )
}