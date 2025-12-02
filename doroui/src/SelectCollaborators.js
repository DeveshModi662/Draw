import Select from "react-select";

const SelectCollaborators = ({ allUsers, selectedUsers, setSelectedUsers }) => {
    console.log('dk-selectCollabs-1-allusers', allUsers) ;
    // allUsers.map(lovVal => console.log(lovVal.username)) ;
    // setSelectedUsers(allUsers.filter(lovVal => lovVal.username === 'user1'))
    console.log('dk-selectCollabs-2-selectedUsers', selectedUsers) ;
  const options = allUsers?.map(user => ({
    value: user.username,
    label: user.username
  }));

  return (
    <Select
      isMulti
      options={options}
      value={options?.filter(option => selectedUsers.includes(option.value))}
      onChange={(selected) => 
        // {
            // if(selected != null)
                setSelectedUsers(selected?.map(item => item.value)) 
        // }
      }
      placeholder="Select collaborators..."
    />
  );
};

export default SelectCollaborators;
