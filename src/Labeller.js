import React, { useState, useEffect, useRef } from 'react';
import './css/App.css';
import { generateKey, printContent } from './helpers.js';


const Labeller = props => {
  const [listLabels, setListLabels] = useState([]);
  const [value, setValue] = useState(0);

  const formResetRef = useRef(0);

  const handleSubmit = event => {
    event.preventDefault();

    // Sanitizes user label name input
    if(value == '') {
      alert('Empty label detected!');
    }
    else if(!listLabels.includes(value)) {
      setListLabels( listLabels.concat(value) );   
    }
    else {
      alert('Duplicate label detected!');
    }

    //  Clears value from input after submitting 
    formResetRef.current.reset();

    // Sets the most recently created label as the selecting one 
    props.toggleSelecting(value);

  }

  const handleChange = event => {
    setValue(event.target.value);
  }

  const handleDeletion = label => {
    const labelToRemove = label;
    props.toggleSelecting('');
    setValue('');
    deleteLabelHighlights(label);
    setListLabels(listLabels.filter(item => item != labelToRemove ));
  }

  const deleteLabelHighlights = label => {
    if(props.selectedText()) {
      props.updateSelectedText(label, [], [], true);
      let spanNodes = document.getElementsByClassName(`${label} tooltip`);
      let spanTooltipNodes = document.getElementsByClassName(`${label} tooltiptext`);
      
      while (spanNodes.length > 0) {
        if(spanTooltipNodes[0].parentNode) {
          spanTooltipNodes[0].parentNode.removeChild(spanTooltipNodes[0]);
          spanNodes[0].outerHTML = spanNodes[0].innerHTML;
        }
      }
    }
    else {
      return;
    }
  }

  const renderLabels = listLabels.map((label) => 
      <li key={generateKey(label)} className={props.isSelecting() == label ? "label-entry selected" : "label-entry"} >
        {label + ':'}
        <button className="delete-button" onClick={ event => { event.preventDefault(); handleDeletion(label) } }>x</button>
      </li>
      );
  
  const renderContent = listLabels.map(label => 
    <li key={generateKey(label)} className="content-entry" >
      {/*<span contentEditable="true">*/}
      <span>
        {props.selectedText().has(label) ? printContent(props.selectedText().get(label)) : 'Select a phrase or word from the left-most area'}
      </span>
      <button onClick={() => {
        if(props.isSelecting() == label) {
          props.toggleSelecting(null);
        } else {
          props.toggleSelecting(label);
        }
        /*
        if(!props.isSelecting() || props.isSelecting() === label) {
          props.toggleSelecting(label);
        } else {
          props.toggleSelecting(null);
        }*/
      }}>
      select
      </button>
    </li>
  );

  useEffect(() => {
    console.log(`${props.isSelecting()} is selecting!`);
  });

  return (
    <section className="labeller">
      <section className="label-table">
      <h2>labels</h2>
        <form ref={formResetRef} onSubmit={handleSubmit}>
          <ul>
              <li className="label-entry">
                <input className="initial-input" name="addButton" type="text" placeholder="Add new Label" onChange={handleChange}/>
                <button className="add-button" type="submit">+</button>
              </li>
              {renderLabels}
          </ul>        
        </form>
      </section>

      <section className="content-table">
      <h2 className="content-header">contents</h2>
        <ul>
          <li><br/></li>
          {renderContent}
        </ul>
      </section>
    </section>
  );
}

export default Labeller;