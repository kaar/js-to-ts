import { useForm } from 'react-hook-form';
import React, { useState } from 'react';
import { useEffect } from 'react';

function App() {
    const [chatBoxState, setChatBoxState] = useState([]);
    const [contextBox, setContextBox] = useState([]);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        const url = 'http://localhost:8000/contexts';
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setContextBox(data.slice(-1)?.content);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);

    const onSubmit = (data) => {
        /* Call to API */
        const url = 'http://localhost:8000/send-question';
        console.log(data.question);

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question: data.question
            })
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Response:', data);
                const conversationItem = {
                    question: data.question,
                    answer: data.answer
                };
                setChatBoxState((previousState) => {
                    const nextState = [...previousState, conversationItem];
                    return nextState;
                });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    console.log(watch('question')); // watch input value by passing the name of it

    /* Text box for instruction set */
    /* Text box for context */
    /* Text box for all the conversations */
    return (
        <>
            <h1>Chatbot</h1>
            <p>Context: {contextBox}</p>

            <ul style={{ display: 'flex', flexDirection: 'column', maxWidth: '600px', border: '2px solid #ccc' }}>
                {chatBoxState.map((item, i) => {
                    return (
                        <React.Fragment key={i}>
                            <li style={{ marginLeft: 'auto' }}>{item.question}</li>
                            <li style={{ marginRight: 'auto' }}>{item.answer}</li>
                        </React.Fragment>
                    );
                })}
            </ul>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input defaultValue="test" {...register('question')} />
                <input type="submit" />
            </form>
        </>
    );
}

export default App;
