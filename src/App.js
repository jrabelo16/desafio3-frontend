import logo from './assets/logo.svg';
import deletar from './assets/delete.svg';
import editar from './assets/edit.svg';
import xis from './assets/xis.svg';
import mais from './assets/mais.svg';
import filter from './assets/filter.svg';
import closeModal from './assets/closeModal.svg'
import { useState, useEffect } from 'react';
import { getDay } from 'date-fns';

function Registro(props) {
  return (
    <div className="table-line">
    <div className="line-items" id="line-item-date">{props.date}</div>
    <div className="line-items">{props.week_day}</div>
    <div className="line-items descricao">{props.description}</div>
    <div className="line-items categoria">{props.category}</div>
    <div className={props.type === 'credit' ? "line-items in" : "line-items out"}>R$ {props.value}</div>
    <div className="line-items">    
      <button className="edit-icon" onClick={()=> {
        props.setRegisterInEditing(
          { 
            id: props.id, 
            date: props.date, 
            description: props.description, 
            category: props.category, 
            value: props.value,
            type: props.type
          }
          );
          if (props.type ==='credit') {
            props.setTypeRegister('credit')
          };
          if (props.type ==='debit') {
            props.setTypeRegister('debit')
          };
          props.setFiltersOn(false);
      }} >
        <img src={editar} alt="Editar registro"/>
      </button>
      <button className="delete-icon" onClick={() => props.handleDelete(props.id)}>
      <img src={deletar} alt="Apagar registro"/>
      </button>
    </div>
    </div>
  )
};

function App() {

  const [registros, setRegistros] = useState([]);
  const [value, setValue] = useState(0);
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [registerInEditing, setRegisterInEditing] = useState(false);
  const [registerInCreating, setRegisterInCreating] = useState(false);
  const [typeRegister, setTypeRegister] = useState('debit');
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);
  const [filtersOn, setFiltersOn] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);


  useEffect(() => {
    loadRegistros();
  }, []); 

  async function loadRegistros() {
    try {
      const response = await fetch('http://localhost:3333/transactions', {
      method: 'GET'
      });
      const dado = await response.json();
      setRegistros(dado);
    } catch (error) {
      console.log(error);
    }
  }
  
  let diaDaSemana = '';

  async function handleRegistro() {
    if (!date || !description || !value || !category) {
      return;
    };
    try {
      if (getDay(new Date(date)) === 0) {
        diaDaSemana = 'Segunda'
      } else if (getDay(new Date(date)) === 1) {
        diaDaSemana = 'Terça'
      } else if (getDay(new Date(date)) === 2) {
        diaDaSemana = 'Quarta'
      } else if (getDay(new Date(date)) === 3) {
        diaDaSemana = 'Quinta'
      } else if (getDay(new Date(date)) === 4) {
        diaDaSemana = 'Sexta'
      } else if (getDay(new Date(date)) === 5) {
        diaDaSemana = 'Sábado'
      } else if (getDay(new Date(date)) === 6) {
        diaDaSemana = 'Domingo'
      }

      const dado = {
        date,
        week_day: diaDaSemana,
        description,
        value: Number(value),
        category,
        type: typeRegister 
      };
      const response = await fetch('http://localhost:3333/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dado)
      });
      await response.json();
      setRegisterInEditing(false);
      setRegisterInCreating(false);
      // setValorCredit(credito);
      loadRegistros();
    } catch (error) {
      console.log(error);
    }
    setDate('');
    setValue(0);
    setDescription('');
    setCategory('');
  }  
  

  async function handleEditarRegistro() {
    if (!date || !description || !value || !category) {
      return;
    };
    try {
      if (getDay(new Date(date)) === 0) {
        diaDaSemana = 'Segunda'
      } else if (getDay(new Date(date)) === 1) {
        diaDaSemana = 'Terça'
      } else if (getDay(new Date(date)) === 2) {
        diaDaSemana = 'Quarta'
      } else if (getDay(new Date(date)) === 3) {
        diaDaSemana = 'Quinta'
      } else if (getDay(new Date(date)) === 4) {
        diaDaSemana = 'Sexta'
      } else if (getDay(new Date(date)) === 5) {
        diaDaSemana = 'Sábado'
      } else if (getDay(new Date(date)) === 6) {
        diaDaSemana = 'Domingo'
      }
      const dado = {
        date,
        week_day: diaDaSemana,
        description,
        value: Number(value),
        category,
        type: typeRegister 
      };
      const response = await fetch(`http://localhost:3333/transactions/${registerInEditing.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dado)
      });
      await response.json();
      loadRegistros();
    } catch (error) {
      console.log(error);
    }
    setRegisterInEditing(false);
    setRegisterInCreating(false);
  }  

  async function handleDelete(id) {
    try {
      await fetch(`http://localhost:3333/transactions/${id}`, {
      method: 'DELETE'
    });
    loadRegistros();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (registerInEditing) {
      setValue(registerInEditing.value);
      setCategory(registerInEditing.category);
      setDate(registerInEditing.date);
      setDescription(registerInEditing.description)
      return;
    }
    setValue(0);
    setCategory('');
    setDate('');
    setDescription('')
  }, [registerInEditing]);

  async function handleCloseModal() {
    setRegisterInEditing(false);
    setRegisterInCreating(false);
  }

  async function handleClickButtonType(event) {
    if (event.target.id === 'credit-button') {
        setTypeRegister('credit');
    }
    if (event.target.id === 'debit-button') {
        setTypeRegister('debit');
    }
}

const credito = registros.filter(registro => registro.type === 'credit').reduce((soma, registro) => {
  return soma + registro.value
}, 0);

const debito = registros.filter(registro => registro.type === 'debit').reduce((soma, registro) => {
  return soma + registro.value
}, 0);

const arrayFilter = registros.filter(registro => registro.value < maxValue && registro.value > minValue);

const listagem = filtersOn ? arrayFilter : registros;
console.log(registros);

  return (
    <div className="App">
      <header className="container-header">
        <img src={logo} alt="Logo"/>
        <h1>Dindin</h1>
      </header>

      <main className="main">
        <div className="filters">
          <button className="open-filters-button" onClick={() => setOpenFilters(!openFilters)}>
            <img className="img-filter" src={filter} alt="Filtros"/>
            Filtrar
          </button>
          <div className= {openFilters ? "container-filters" : "escondido"}>
            <div className="week-day-filter">
              <h1>Dia da semana</h1>
              <div className="container-chip">
                <span>Segunda</span>
                <img src={mais} alt="Adicionar"/>
              </div>
              <div className="container-chip">
                <span>Terça</span>
                <img src={xis} alt="Remover"/>
              </div>
            </div>
            <div className="category-filter">
              <h1>Categoria</h1>
              <div className="container-chip">
                <span>Categoria 1</span>
                <img src={mais} alt="Adicionar"/>
              </div>
              <div className="container-chip">
                <span>Categoria 2</span>
                <img src={xis} alt="Remover"/>
              </div>
            </div>
            <div className="value-filter">
              <h1>Valor</h1>
              <input className="input-value-filter" type="number" id="min-value" onChange={e => setMinValue(e.target.value)} value={minValue}></input>
              <input className="input-value-filter" type="number" id="max-value" onChange={e => setMaxValue(e.target.value)} value={maxValue}></input>
            </div>
            <div className="buttons-filter">
              <button className="btn-clear-filters" onClick={() => setFiltersOn(false)}>Limpar filtros</button>
              <button className="btn-apply-filters" onClick={() => setFiltersOn(true)}>Aplicar filtros</button>
            </div>
          </div>
        </div>

        <div className="container-table-resume">
          <div className="table">
            <h1>Tabela</h1>
            <div className="table-head">
              <div className="column-title" id="date">Data</div>
              <div className="column-title" id="week-day">Dia da semana</div>
              <div className="column-title descricao">Descrição</div>
              <div className="column-title categoria">Categoria</div>
              <div className="column-title" id="value">Valor</div>
              <div className="column-title" id="value"></div>
            </div>

            <div className="table-body">
              <div className="container-table-line-actions">

                {listagem.map(registro => {
                  return <Registro 
                  key={registro.id}
                  id={registro.id}
                  date={registro.date} 
                  week_day={registro.week_day} 
                  description={registro.description} 
                  category={registro.category} 
                  value={registro.value} 
                  type={registro.type}
                  handleDelete={handleDelete}
                  setRegisterInEditing={setRegisterInEditing}
                  typeRegister={typeRegister}
                  setTypeRegister={setTypeRegister}
                  setFiltersOn={setFiltersOn}/>
                })}
              
                <div className="container-confirm-delete escondido">
                  <p>Apagar item?</p>
                  <div className="container-btn-confirm-delete">
                    <button className="btn-actions-confirm-delete">Sim</button>
                    <button className="btn-actions-confirm-delete">Não</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="container-resumo-btn">
            <div className="container-resumo">
              <h1>Resumo</h1>
              <p className="resumo-in-out">Entradas
                <span className="in">R$ {credito}</span>
              </p>
              <p className="resumo-in-out">Saídas
                <span className="out">R$ {debito}</span>
              </p>
              <p className="balance-p">Saldo
                <span className="balance">R$ {credito - debito}</span>
              </p>
            </div>
            <button className="btn-add" onClick={() => {
              setTypeRegister('debit'); 
              setRegisterInCreating(true);
              setFiltersOn(false);
              setValue(0);
              setCategory('');
              setDate('');
              setDescription('');
            }
            }>Adicionar Registro</button>
          </div>
        </div>
        
      </main>

      <div className={(registerInEditing || registerInCreating) ? "modal-container " : "modal-container escondido"}>
        <div className="modal">
          <button className="close-icon" onClick={() => handleCloseModal()}>
            <img src={closeModal} alt="Fechar modal"/>
          </button>
          <h1 className="titulo-modal">{registerInEditing ? 'Editar' : 'Adicionar'} Registro</h1>
          <div className="btn-credit-debit">
            <button className={typeRegister === 'credit' ? "btn-credit btn-credit-ative" : "btn-credit btn-credit-debit-inative"} id="credit-button" onClick={(e) => handleClickButtonType(e)}>Entrada</button>
            <button className={typeRegister === 'debit' ? "btn-debit btn-debit-ative" : "btn-debit btn-credit-debit-inative"} id="debit-button" onClick={(e) => handleClickButtonType(e)}>Saída</button>
          </div>
          <label>Valor</label>
          <input type="number" name="value" onChange={e => setValue(e.target.value)} value={value}/>
          <label>Categoria</label>
          <input type="text" name="category" onChange={e => setCategory(e.target.value)} value={category}/>
          <label>Data</label>
          <input type="date" name="date" onChange={e => setDate(e.target.value)} value={date}/>
          <label>Descrição</label>
          <input type="text" name="description" onChange={e => setDescription(e.target.value)} value={description}/>
          <button className="btn-insert" onClick={() => registerInEditing ? handleEditarRegistro() : handleRegistro()}>
              Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
