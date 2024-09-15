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
            <img src='./icons/CoSMoStudio.png' alt='CS-banner' className='CS-banner'></img>
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
                        <p>After building your own constructor, click on the "Add an Existing Constructor" button to add constructors from the central repository. Constructors can then be combined using the following connectors:</p>
                        <ul>
                            <li>Sub-Constructor: Subtype constructor between local variables.</li>
                            <li>Instance Of: Instance constructor between local variables. </li>
                            <li>Part Of: Connect a Type Constructor as part of another Type Constructor, or an Instance Constructor as part of another Instance Constructor.</li>
                        </ul>
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
                        <p>After building a constructor, select your preferred language from the language drop-down. Thereafter, click the "Generate Text" button to generate the textual version of your constructor.</p>

                        <img src='./icons/GenText.png' width="800px"></img>

                        <p>You can then scroll through the textbox below the node editor to view the textual constructor.</p>
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
                            After building a constructor, save it by clicking on the "Save Constructor" button. Provide a name, collection and description for the constructor. New collections can be added by clicking on the "Add a new collection" button. You can then view your saved constructor in the "My Constructors" tab.
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
                        <p>CoSMo constructors must adhere to the CoSMo syntax. The rules for the CoSMo syntax are as follows:</p>
                        <ul>
                            <li>There can be no "hanging" nodes in a constructor, meaning that every node must have at least one connector.</li>
                            <li>Property elements must have at least two roles.</li>
                            <li>Argument elements must be connected to at least one function and one object.</li>
                            <li>Every constructor must have a starting element of type 'Instance Constructor' or 'Type Constructor'.</li>
                            <li>Join nodes must be connected to two objects.</li>
                            <li>The Role connector can only be used between an Object and a Property, a Property and an Object, an Object and an Argument or an Argument and a function.</li>
                            <li>The Sub Constructor connector can only be used between two Type Constructor elements.</li>
                            <li>The Instance Of connector can only be used between an Instance Constructor element and a Type Constructor element, or between a Value Constraint and an Object element.</li>
                            <li>The Part Of connector can only be used between two Type Constructor elements or two Instance Constructor elements.</li>
                            <li>The Is Mandatory connector can only be used between an Object and a Property.</li>
                            <li>The Join connector can only be used two Object elements or two Property elements.</li>
                            <li>The Role Name connector can only be used between a Role Name and a Property.</li>
                            <li>The Value Constraint connector can only be used between a Value Constraint and a Function.</li>
                        </ul>

                        <p>CoSMo syntax errors will guide you in building constructors in the correct CoSMo syntax. Upon encountering a CoSMo syntax error, click "Okay" and modify the constructor according to the given error.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserManual;