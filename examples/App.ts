import { useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';

interface ConversationItem {
    question: string;
    answer: string;
}

function App() {
    const [chatBoxState, setChatBoxState] = useState<ConversationItem[]>([]);
    const [contextBox, setContextBox] = useState<string[]>([]);
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
            .then((data: string[]) => {
                console.log(data);
                setContextBox(data.slice(-1));
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);

    const onSubmit = (data: { question: string }) => {
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
            .then((data: ConversationItem) => {
                console.log('Response:', data);
                setChatBoxState((previousState) => {
                    const nextState = [...previousState, data];
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
                {chatBoxState.map((item, i) => (
                    <React.Fragment key={i}>
                        <li style={{ marginLeft: 'auto' }}>{item.question}</li>
                        <li style={{ marginRight: 'auto' }}>{item.answer}</li>
                    </React.Fragment>
                ))}
            </ul>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input defaultValue="test" {...register('question')} />
                <input type="submit" />
            </form>
        </>
    );
}

export default App;
