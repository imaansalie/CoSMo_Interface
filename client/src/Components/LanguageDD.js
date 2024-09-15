import React, {useState, useEffect} from "react";
import axios from "axios";

export const LanguageDD = ({selectedLanguage, setSelectedLanguage}) =>{

    const [languages, setLanguages] = useState([]);

    useEffect(() =>{
        //fetch items based on item type
        axios.post('http://localhost:3001/getLanguages').then((response) =>{
            const filteredLanguages = response.data.filter(language => language.COLUMN_NAME !== 'idlanguages');
            setLanguages(filteredLanguages);
        }).catch(error=>{
            console.error("Error getting items."+error);
        })
    },[]);

    const handleChange = (event) =>{
        const newLanguage= event.target.value;
        setSelectedLanguage(newLanguage);
    }

    useEffect(() => {
        console.log("Updated selectedLanguage after render: ", selectedLanguage);
    }, [selectedLanguage]);

    const formatLabel = (text) => {
        return text.replace(/_/g, ' ');
    };

    return(
        <div className="settings">
            <select 
                className="language-dropdown"
                id="language-dd"
                value={selectedLanguage}
                onChange={handleChange}
            >
                {languages.map((language, index) => (
                <option className= "language-options" key= {index} value ={language.COLUMN_NAME}>
                    {formatLabel(language.COLUMN_NAME)}
                </option>
            ))}</select>
        </div>
    )
}