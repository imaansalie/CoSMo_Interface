import React, { useState } from 'react';
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";

const UserManual = () =>{
    const [divOne, setDivOne] = useState(false);
    const [divTwo, setDivTwo] = useState(false);
    const [divThree, setDivThree] = useState(false);
    const [divFour, setDivFour] = useState(false);
    const [divFive, setDivFive] = useState(false);
    const [divSix, setDivSix] = useState(false);
    const [divSeven, setDivSeven] = useState(false);
    const [divEight, setDivEight] = useState(false);
    const [divNine, setDivNine] = useState(false);

    const toggleDiv1 = () => {
        setDivOne((prevState) => !prevState); 
    };

    const toggleDiv2 = () => {
        setDivTwo((prevState) => !prevState); 
    };

    const toggleDiv3 = () => {
        setDivThree((prevState) => !prevState); 
    };

    const toggleDiv4 = () => {
        setDivFour((prevState) => !prevState); 
    };

    const toggleDiv5 = () => {
        setDivFive((prevState) => !prevState); 
    };

    const toggleDiv6 = () => {
        setDivSix((prevState) => !prevState); 
    };

    const toggleDiv7 = () => {
        setDivSeven((prevState) => !prevState); 
    };

    const toggleDiv8 = () => {
        setDivEight((prevState) => !prevState); 
    };

    const toggleDiv9 = () => {
        setDivNine((prevState) => !prevState); 
    };

    return(
        <div className='UM-container'>
            <img src='./icons/CoSMoStudio.png' alt='CS-banner' width={"1300px"} className='CS-banner'></img>
            <div className={`toggle-box ${divOne ? 'expanded' : ''}`}>
                <p className='toggle-heading'>How to Initiate a Constructor</p>
                <button onClick={toggleDiv1} className='toggle-button'>
                    {divOne ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </button>
                {divOne &&(
                    <div  className="toggle-content">
                        <p>All constructors must begin with either an <b>'Instance Constructor'</b> node, or a <b>'Type Constructor'</b> node. Add a node by clicking on it in the toolbox, and providing a label for your constructor.</p>
                        <img src= "./icons/InitiatingConstructor.gif" width={"800px"} style={{marginLeft:"40px"}}></img>
                    </div>
                )}
            </div>
            <div className={`toggle-box ${divTwo ? 'expanded' : ''}`}>
                <p className='toggle-heading'>How to Add Elements to a Constructor</p>
                <button onClick={toggleDiv2} className='toggle-button'>
                    {divTwo ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </button>
                {divTwo &&(
                    <div  className="toggle-content">
                        <p>Add elements to a constructor by clicking on an element in the toolbox.<b>'Object', 'Function', 'Property' and 'Role name'</b> nodes require data assignment. After adding a CoSMo element to the editor, select the data item you would like to assign to the element. For <b>'Value Constraint'</b> nodes, you can either enter a custom value, or assign a Q item from the database.</p>
                    </div>
                )}
            </div>
            <div className={`toggle-box ${divThree ? 'expanded' : ''}`}>
                <p className='toggle-heading'>How to Add Connectors between Elements</p>
                <button onClick={toggleDiv3} className='toggle-button'>
                    {divThree ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </button>
                {divThree &&(
                    <div  className="toggle-content">
                        <p>Add connectors between elements by selecting a connector, and dragging it between the handles of two elements.</p>
                        <img src= './icons/AddingConnectors.gif' width={"800px"}></img>
                    </div>
                )}
            </div>
            <div className={`toggle-box ${divFour ? 'expanded' : ''}`}>
                <p className='toggle-heading'>How to Add Properties to a Constructor</p>
                <button onClick={toggleDiv4} className='toggle-button'>
                    {divFour ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </button>
                {divFour &&(
                    <div  className="toggle-content">
                        <p>To add a property to a constructor:
                            <ol>
                                <li>Click on the 'Property' element in the toolbox.</li>
                                <li>Choose the number of roles. A maximum of five roles can be chosen.</li>
                                <li>Assign a P item to the 'Property' element.</li>
                                <li>Connect the desired 'Object' element to the 'Property' element using the 'Role' connector.</li>
                            </ol>
                        </p>
                        <video width="700px" controls style={{marginLeft:"90px"}}>
                            <source src="./icons/AddingProperties.mp4" type="video/mp4"/>
                            Your browser does not support the video tag.
                        </video>
                    </div>
                )}
            </div>
            <div className={`toggle-box ${divFive ? 'expanded' : ''}`}>
                <p className='toggle-heading'>How to Add Functions to a Constructor</p>
                <button onClick={toggleDiv5} className='toggle-button'>
                    {divFive ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </button>
                {divFive &&(
                    <div  className="toggle-content">
                        <p>To add a function with arguments to a constructor:
                            <ol>
                                <li>Click on the 'Arguments' element in the toolbox.</li>
                                <li>Choose the number of arguments. A maximum of four arguments can be chosen.</li>
                                <li>Click on the 'Function' element.</li>
                                <li>Assign a Z item to the 'Function' element from the database.</li>
                                <li>Connect the desired 'Object' element to the 'Arguments' element using the 'Role' connector. Repeat for as many arguments as you have selected.</li>
                                <li>Connect the 'Arguments' element to the 'Function' element using the 'Role' connector.</li>
                            </ol>
                        </p>
                        <video width="700px" controls style={{marginLeft:"90px"}}>
                            <source src="./icons/AddingFunctions.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                )}
            </div>
            <div className={`toggle-box ${divSix ? 'expanded' : ''}`}>
                <p className='toggle-heading'>How to Combine Constructors</p>
                <button onClick={toggleDiv6} className='toggle-button'>
                    {divSix ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </button>
                {divSix &&(
                    <div  className="toggle-content">
                        <p>blah blah combine</p>
                    </div>
                )}
            </div>
            <div className={`toggle-box ${divSeven ? 'expanded' : ''}`}>
                <p className='toggle-heading'>How to Generate the Textual Version of Constructors</p>
                <button onClick={toggleDiv7} className='toggle-button'>
                    {divSeven ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </button>
                {divSeven &&(
                    <div  className="toggle-content">
                        <p>blah blah generate text
                        </p>
                    </div>
                )}
            </div>
            <div className={`toggle-box ${divEight ? 'expanded' : ''}`}>
                <p className='toggle-heading'>How to Save a Constructor</p>
                <button onClick={toggleDiv8} className='toggle-button'>
                    {divEight ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </button>
                {divEight &&(
                    <div  className="toggle-content">
                        <p>
                        </p>
                    </div>
                )}
            </div>
            <div className={`toggle-box ${divNine ? 'expanded' : ''}`}>
                <p className='toggle-heading'>Syntax Validation Rules</p>
                <button onClick={toggleDiv9} className='toggle-button'>
                    {divNine ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </button>
                {divNine &&(
                    <div  className="toggle-content">
                        <p>
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserManual;