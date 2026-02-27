import { forwardRef, SyntheticEvent, useState, Ref } from "react";
import SelectDropdown from "../SelectDropdown";
import DictionaryModal from "./DictionaryModal";

const SelectWithAdd = forwardRef(function SelectWithAdd({
    name,
    inputValue,
    onChange,
    loadRemoteData,
    createRequest,
    errorText,
    inputPlaceholder,
    disabled
}: any, ref: Ref<unknown>) {
    const [open, setOpen] = useState(false);
    const [inputText, setInputText] = useState<any>('');

    const onValueChange = (_event: SyntheticEvent<Element, Event>, newValue: any) => {
        if (typeof newValue === 'string') {
            setTimeout(() => {
                setOpen(true)
                setInputText(newValue);
            });
        } else if (newValue && newValue.inputValue) {
            setOpen(true);
            setInputText(newValue.inputValue);
        } else {
            onChange(newValue)
        }
    };

    return (
        <div>
            <SelectDropdown
                selectOnFocus
                clearOnBlur
                disabled={disabled}
                inputPlaceholder={inputPlaceholder}
                onChange={onValueChange}
                onAddItem={() => { setOpen(true); setInputText(''); }}
                value={inputValue}
                loadRemoteData={loadRemoteData}
                errorText={errorText}
                freeSolo={true}
                ref={ref}
            />
            <DictionaryModal
                open={open}
                setOpen={setOpen}
                name={name}
                inputText={inputText}
                onValueChange={onChange}
                setInputText={setInputText}
                createRequest={createRequest}
            />
        </div>
    )
});

export default SelectWithAdd;