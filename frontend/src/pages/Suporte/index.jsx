import React from 'react';

import TopBarMenu from '../../Components/TopBarMenu';
import SideBarMenu from '../../Components/SideBarMenu';
import LabelTitles from '../../Components/LabelTitles';
import SimpleButton from '../../Components/SimpleButton';

import { FaFacebook as FacebookIcon} from "react-icons/fa6";
import { FaWhatsapp as WhatsAppIcon} from "react-icons/fa";
import { FaInstagram as InstagramIcon } from "react-icons/fa";
import { CiGlobe as GloboIcon } from "react-icons/ci";

import styles from './Suporte.module.css';


// Tela de ajuda e suporte ao cliente
const Suporte = () => {
    const onSubmit = (e) => {
        e.preventDefault();
        // Implementar logica de envio de mensagem por email

    }


    return (
        <div className={styles.MainScreen}>
            <TopBarMenu />
            <SideBarMenu  />
            <div className={styles.SuporteDiv}>
                <LabelTitles nameClass={styles.tituloPaginaAtual} text="Precisa de ajuda?" />
                <h3>
                    Entre em contato em nossas redes sociais
                </h3>
                <div className={styles.iconesRedesSociais}>
                    <a href={"https://pt-br.facebook.com/"} rel="_external" target='_blank'>
                        <FacebookIcon />
                    </a>
                    <a href="https://www.whatsapp.com/" rel="_external" target='_blank'>
                        <WhatsAppIcon />
                    </a>
                    <a href="https://www.instagram.com/" rel="_external" target='_blank'>
                        <InstagramIcon />
                    </a>
                    <a href="http://localhost:5173/nossa-pagina" rel="_external" target='_blank'>
                        <GloboIcon />
                    </a>
                </div>
                <h3>
                    Ou <br/> envie-nos uma mensagem por email e responderemos assim que possivel
                </h3>
                <form onSubmit={onSubmit}>
                    <div>
                        <textarea name="mensagem" cols="1" rows="1" className={styles.message} placeholder='Escreva sua mensagem'/>
                    </div>
                    <div>
                        <SimpleButton type="submit" textButton="Enviar"/>
                    </div>
                </form>

            </div>
        </div>
    );
}

export default Suporte;