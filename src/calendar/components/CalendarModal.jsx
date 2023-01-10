import { useEffect, useMemo, useState } from 'react';

import { differenceInSeconds, addHours } from 'date-fns';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import './CalendarModal.css';
import 'sweetalert2/dist/sweetalert2.min.css';

import { useCalendarStore, useUiStore } from '../../hooks';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

export const CalendarModal = () => {

    const { isDateModalOpen, closeDateModal } = useUiStore();
    const { activeEvent, startSavingEvent } = useCalendarStore();

    const [formSubmitted, setFormSubmitted] = useState(false);

    const [formValues, setFormValues] = useState({
        title: '',
        notes: '',
        start: new Date(),
        end: addHours( new Date(), 2 ),
    });

    const titleClass = useMemo(() => {
        if (!formSubmitted) return '';
        return ( formValues.title.length > 0 ) ? '' : 'is-invalid';

    }, [formValues.title, formSubmitted]);

    useEffect(() => {
        if (activeEvent !== null) {
            setFormValues({ ...activeEvent });
        }
    }, [ activeEvent ]);
    

    const onInputChange = ({ target }) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value,
        });
    }

    const onDateChange = (e, changing) => {
        setFormValues({
            ...formValues,
            [changing]: e,
        });
    };

    const onCloseModal = () => {
        closeDateModal();
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setFormSubmitted(true);
        const diff = differenceInSeconds( formValues.end, formValues.start );
        if(isNaN(diff) || diff <= 0) {
            Swal.fire('Invalid dates', '', 'error');
            return;
        };
        if(formValues.title.length <= 0) return;
        await startSavingEvent( formValues );
        closeDateModal();
        setFormSubmitted(false);

    };

    return (
        <Modal
            isOpen={ isDateModalOpen }
            onRequestClose={ onCloseModal }
            style={ customStyles }
            className='modal'
            overlayClassName='modal-fondo'
            closeTimeoutMS={ 200 }
        >
            <h1> New event </h1>
            <hr />
            <form className="container" onSubmit={ onSubmit }>

                <div className="form-group mb-2">
                    <label>Date time starter</label>
                    <DatePicker
                        selected={ formValues.start }
                        onChange={ event => onDateChange(event, 'start') }
                        className='form-control'
                        dateFormat='Pp'
                        showTimeSelect
                    />
                </div>

                <div className="form-group mb-2">
                    <label>Date time ending</label>
                    <DatePicker
                        minDate={ formValues.start }
                        selected={ formValues.end }
                        onChange={ event => onDateChange(event, 'end') }
                        className='form-control'
                        dateFormat='Pp'
                        showTimeSelect
                    />
                </div>

                <hr />
                <div className="form-group mb-2">
                    <label>Title and notes</label>
                    <input 
                        type="text" 
                        className={`form-control ${ titleClass }`}
                        placeholder="Title"
                        name="title"
                        autoComplete="off"
                        value={ formValues.title }
                        onChange={ onInputChange }
                    />
                    <small id="emailHelp" className="form-text text-muted">Description</small>
                </div>

                <div className="form-group mb-2">
                    <textarea 
                        type="text" 
                        className="form-control"
                        placeholder="Notes"
                        rows="5"
                        name="notes"
                        value={ formValues.notes }
                        onChange={ onInputChange }
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">Information</small>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> Save</span>
                </button>

            </form>
        </Modal>
    )
}
