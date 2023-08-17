import CreatableReactSelect from "react-select/creatable";
import { v4 as uuidv4 } from "uuid";
import useAddNote from "../hooks/useAddNote";


type NoteTagsProps = {
    type : string,
}

function NoteTags(props: NoteTagsProps) {

const {setSelectedTags, selectedTags, addTags, noteAllTags} = useAddNote(props.type)

  return (
    <>
    <CreatableReactSelect
    className="bg-transparent"
    styles={{
        control: (baseStyles, state) => ({
            ...baseStyles,
            backgroundColor: state.isFocused
            ? "transparent"
            : "transparent",
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
            ? "transparent"
            : state.isFocused
            ? "transparent"
            : "transparent",
            color: state.isSelected ? "white" : "black",
            cursor: "pointer",
        }),
    }}
    onCreateOption={(label) => {
        const valueId = uuidv4()
        setSelectedTags([
            ...selectedTags,
            { label: label, value: valueId },
        ]);
        addTags(valueId, label);
    }}
    value={selectedTags}
    options={noteAllTags?.docs.map((e)=>{
        return {value: e.data().value, label: e.data().label}
    })}
    onChange={(tags) =>
        setSelectedTags(
            tags.map((tag) => {
                return { label: tag.label, value: tag.value };
            })
            )
        }
        isMulti
        />
        </>
  )
}

export default NoteTags
