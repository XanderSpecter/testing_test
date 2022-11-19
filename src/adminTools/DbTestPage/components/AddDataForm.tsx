import React, { useState } from 'react';
import { savePage } from '../../api';

interface NewField {
    name: string;
    value: string;
}

const emptyNewField: NewField = {
    name: '',
    value: '',
};

const AddDataForm = () => {
    const [fields, setFields] = useState<Record<string, string>>({});
    const [newField, setNewField] = useState<NewField | null>(null);
    const [recordName, setRecordName] = useState<string>('');

    const toggleNewFieldEditing = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (!newField) {
            setNewField(emptyNewField);
        } else {
            setNewField(null);
        }
    };

    const saveData = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (recordName && Object.keys(fields).length > 0) {
            savePage(recordName, fields);
        }
    };

    const addField = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (newField && newField.name && newField.value) {
            setFields({ ...fields, [newField.name]: newField.value });
            setNewField(null);
        }
    };

    const removeField = (name: string) => {
        if (fields[name]) {
            const newFields = { ...fields };

            delete newFields[name];

            setFields({ ...newFields });
        }
    };

    const onRecordNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value || '';

        setRecordName(newValue);
    };

    const onFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fieldName = e.target.name;
        const newValue = e.target.value || '';

        if (newField && fieldName === 'name') {
            setNewField({ ...newField, name: newValue });
        }

        if (newField && fieldName === 'value') {
            setNewField({ ...newField, value: newValue });
        }
    };

    const renderAddedFields = () => {
        return (
            <div style={{ marginTop: '16px' }}>
                {Object.keys(fields).map((key) => (
                    <div style={{ marginTop: '8px' }} key={key}>
                        <span>{`${key} : ${fields[key]}`}</span>
                        <button
                            type="button"
                            style={{ marginLeft: '8px' }}
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                e.preventDefault();
                                e.stopPropagation();

                                removeField(key);
                            }}
                        >
                            Удалить
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    const renderNewFieldForm = () => {
        if (!newField) {
            return null;
        }

        return (
            <form onSubmit={addField} style={{ marginTop: '16px' }}>
                <input
                    name="name"
                    value={newField.name}
                    placeholder="Имя поля (обязательно)"
                    onChange={onFieldChange}
                />
                <input
                    name="value"
                    value={newField.value}
                    placeholder="Значение поля (обязательно)"
                    onChange={onFieldChange}
                />
                <button type="submit">Добавить</button>
            </form>
        );
    };

    return (
        <>
            <input
                style={{ marginTop: '16px' }}
                name="record"
                value={recordName}
                placeholder="Имя записи (обязательно)"
                onChange={onRecordNameChange}
            />
            {renderAddedFields()}
            <button style={{ marginTop: '16px' }} type="button" onClick={toggleNewFieldEditing}>
                {newField ? 'Отмена' : 'Добавить поле'}
            </button>
            {renderNewFieldForm()}
            <br />
            <button style={{ marginTop: '16px' }} type="button" onClick={saveData}>
                Сохранить запись в БД
            </button>
        </>
    );
};

export default AddDataForm;
