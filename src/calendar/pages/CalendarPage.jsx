import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { CalendarEvent, CalendarModal, FabAddNew, FabDelete, NavBar } from '../';
import { localizer } from '../../helpers';
import { useState } from 'react';
import { useCalendarStore, useUiStore } from '../../hooks';

export const CalendarPage = () => {

    const { events, setActiveEvent } = useCalendarStore();

    const { openDateModal } = useUiStore();

    const [ lastView, setLastView ] = useState(localStorage.getItem('lastView') || 'week');

    const eventStyleGetter = ( event, start, end, isSelected ) => {
        const style = {
            backgroundColor: '#347CF7',
            borderRadius: '0px',
            opacity: 0.8,
            color: 'white',
        };

        return { style };
    };

    const onDoubleClick = (e) => {
        openDateModal();
    };

    const onSelect = (e) => {
        setActiveEvent(e);
    };

    const onViewChange= (e) => {
        localStorage.setItem('lastView', e);
    };

    return (
        <>
            <NavBar />

            <Calendar
                defaultView={ lastView }
                localizer={ localizer }
                events={ events }
                startAccessor="start"
                endAccessor="end"
                style={{ height: 'calc( 100vh - 80px)' }}
                eventPropGetter= { eventStyleGetter }
                components={{
                    event: CalendarEvent
                }}
                onDoubleClickEvent={ onDoubleClick }
                onSelectEvent={ onSelect }
                onView={ onViewChange }
            />

            <CalendarModal />
            <FabAddNew />
            <FabDelete />
        </>
    )
}
