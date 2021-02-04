import React, {useEffect, useState} from 'react'
import{api} from '../api' 
import axios from 'axios';
import YaziYorumlari from './YaziYorumlari';
import SilModal from './SilModal';
import {Link} from 'react-router-dom'

const YaziDetay = (props) => {
    const {id} = props.match.params;
    const [yaziDetayi, setYaziDetayi] = useState({});
    const [yorumlar, setYorumlar] = useState([]);
    // const [yorum, setYorum] = useState(YORUM_BASLANGIC)

    const handleCommentSubmit = (e, yorum)  => {
        e.preventDefault();
       api()
        .post(`/posts/${id}/comments`, 
            yorum
        )
        .then((response) => {
                setYorumlar([...yorumlar, response.data]); // önceki yorumları kaybetmemek için ...yorumları koyduktan sonra yeni datayı ekledik
        })
    }

    useEffect(() => {
        axios
          .all([api().get(`/posts/${id}`), api().get(`/posts/${id}/comments`)])// aynı anda iki tane get i yaptık. Bu şekilde toplayabilir ve tek bir then altında state i set edebiliriz
          .then((responses) => {
            setYaziDetayi(responses[0].data);// yazılardan ve yorumlardan gelen dataları ayırdık
            setYorumlar(responses[1].data);
          })
          .catch((error) => {
            console.log(error);
          });
      }, []);
    return <>
        <h2 className="ui header">{yaziDetayi.title}</h2>
        <p>{yaziDetayi.created_at}</p>
        <div className="ui buttons">
            {/* <button className="ui button">Sil</button> */}
            <SilModal yazi={yaziDetayi} push={props.history.push}/>
            <div className="or"></div>
            <Link to={`/posts/${yaziDetayi.id}/edit`} className="ui positive button">Düzenle</Link>
        </div>
        <p>{yaziDetayi.content}</p>
        <YaziYorumlari yorumlar={yorumlar} handleSubmit={handleCommentSubmit}/>
       
    </>
}
export default YaziDetay;
