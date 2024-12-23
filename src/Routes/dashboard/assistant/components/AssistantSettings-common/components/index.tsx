import {
    AgentProfilePicture,
    ChooseFileBtn,
    ChooseIcon,
    ChangeIcon,
  } from "@/assets/svg";
  import TestAgent from "./TestAgent/TestAgent";
  import { useState, useEffect, Fragment } from "react";
//   import WordinessLevelModal from "./SettingsLayout/WordinessLevelModal";
//   import SaveChanges from "./SettingsLayout/SaveChanges";
  import { CgSpinner } from "react-icons/cg";
  import DefaultImage from "@/assets/DefaultImage.png";
  import { Switch } from "@headlessui/react";

  import DeleteAppModal from "./SettingsLayout/DeleteAppModa";
  import DeactivateAppModal from "./SettingsLayout/DeactivateAppModal";
  import { useLocation } from "react-router";
  import { useAppDispatch, useAppSelector } from "@/redux-slice/hooks";
  
  const AssistantSettings: React.FC = () => {
    const dispatch = useAppDispatch();
    // const getAgentApplication = useSelector(
    //   (state) => state?.getApplicationByUserId
    // );
    // const agentType = getAgentApplication?.data?.data[0]?.type || " ";
    // const fullAgent = getAgentApplication?.agent || null;
    // const newagentType = fullAgent?.type || null;
    // const reset = useSelector((state) => state.agentReset);
  
    // const { userType } = useContext(UserContext);
    // const [showPersonalityModal, setShowPersonalityModal] = useState(false);
    // const [showWordinessModal, setShowWordinessModal] = useState(false);
    // const [showSaveChangesModal, setShowSaveChangesModal] = useState(false);
    // const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);
    // const [selectedImage, setSelectedImage] = useState("");
    // const [selectedImage2, setSelectedImage2] = useState("");
    // const [openBottomGuide, setOpenBottomGuide] = useState(false);
    // const [openConfirmModal, setOpenConfirmModal] = useState(false);

    const [enabled, setEnabled] = useState(false);
    const [openAgentCategory, setOpenAgentCategory] = useState(false);
    const [change, setChange] = useState(false);
  
    // const [selectedCountryCode, setSelectedCountryCode] = useState(
    //   Countries.length > 0 ? Countries[0].code : ""
    // );
    // const [phoneNumber, setPhoneNumber] = useState("");
    const [verifyLoading, setVerfyLoading] = useState(false);
    const [selectedPersonality, setSelectedPersonality] = useState("");
    const [selectedVerbosity, setSelectedVerbosity] = useState("");
    const [phoneNumberData, setPhoneNumbrData] = useState([]);
  
    const [data, setData] = useState({
      name: "",
      description: "",
      icon_url: null,
      verbose: "",
    });
    
    // const fetchData = async () => {
    // //   if (!applicationId) {
    // //     console.error(
    // //       "No applicationId provided. fetchData function will not run."
    // //     );
    // //     return;
    // //   }
    //   // setLoading(true);
    //   try {
    //     const response = await dispatch
    //     // axios.get(
    //     //   `${URL}/dashboard/applications/${applicationId}`,
    //     //   {
    //     //     headers: {
    //     //       Authorization: `Bearer ${token}`,
    //     //     },
    //     //   }
    //     // );
    //     // const result = response.data.data.draft
    //     //   ? response.data.data.draft
    //     //   : response.data.data;
    //     // setData({
    //     //   name: result.name,
    //     //   description: result.description,
    //     //   icon_url: result.icon_url || null,
    //     //   personality_type: result.personality_type,
    //     //   verbose: result.verbose,
    //     // });
    //     // setLoading(false);
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //     // setLoading(false);
    //   }
    // };
  
    // // useEffect(() => {
    // //   dispatch(getApplicationById());
    // // }, [reset?.loading]);
  
    useEffect(() => {
      if (change === true) {
        setOpenConfirmModal(true);
      }
    }, [change]);
  
    const handleImageChange = (e) => {
      const file = e.target.files[0];
  
      if (file) {
        setSelectedImage(file);
  
        setData((prevData) => ({
          ...prevData,
          icon_url: file, // Set the file directly
        }));
  
        const reader = new FileReader();
  
        reader.onload = (e) => {
          const imageDataUrl = e.target.result;
          setSelectedImage2(imageDataUrl); // Set the preview state
        };
  
        reader.onerror = (error) => {
          console.error("Error reading the file:", error);
        };
  
        reader.readAsDataURL(file);
      }
    };
  
    const handleSave = async () => {
      try {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("personality_type", data.personality_type);
        formData.append("verbose", data.verbose);
        formData.append("type", agentDetails.type);
  
        if (selectedImage) {
          formData.append("file", selectedImage);
        }
  
        const response = await 
        // {// axios.put(
        // //   `${URL}/dashboard/applications/${applicationId}`,
        // //   formData,
        // //   {
        // //     headers: {
        // //       Authorization: `Bearer ${token}`,
        // //       "Content-Type": "multipart/form-data", // Set content type to multipart/form-data
        // //     },
        // //   }
        // // );
        // }

        // const object = {
        //   ...(response?.data?.data?.draft
        //     ? response?.data?.data?.draft
        //     : response?.data?.data),
        // };
        // object.id = response?.data?.data?.id
        // dispatch(setAgent(object));
        // dispatch(getApplicationById());
        // if(applicationId){
        // dispatch(getApplicationDraft(applicationId));
        // }
        // const result = response?.data?.data?.draft;
        // setData(result);
    
        addToast("Your details have been uploaded successfully");
       
      } catch (error) {
        console.error("Error updating data:", error);
        setError("Error updating data. Please try again.");
        
      }
    };
  
    const handleCountryChange = (event) => {
      const countryCode = event.target.value
        .split(" ")[1]
        .replace("(", "")
        .replace(")", "");
      setSelectedCountryCode(countryCode);
    };
  
    const handleSavePersonality = (personality) => {
      setSelectedPersonality(personality);
      setData((prevData) => ({
        ...prevData,
        personality_type: personality,
      }));

    };
  
    const handleVerbosity = (Verbosity) => {
      setSelectedVerbosity(Verbosity);
      setData((prevData) => ({
        ...prevData,
        verbose: Verbosity,
      }));

    };
    const fetchNumbers = () => {
      if (!applicationId) {
        console.error(
          "No applicationId provided. fetchData function will not run."
        );
        return;
      }
      try {
        // axios
        //   .get(`${URL}/dashboard/applications/${applicationId}/session`, {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //   })
        //   .then((response) => {
        //     // Access the data inside the PromiseResult
        //     const responseData = response && response?.data?.data;
        //     setPhoneNumbrData(responseData);
        //   })
        //   .catch((error) => {
        //     console.error("Error fetching data:", error);
        //   });
      } catch (error) {
        console.error("Error making request:", error);
      }
    };
  
    // useEffect(() => {
    //   fetchData();
    //   // fullAgent
    //   if (fullAgent.id) {
    //     setData({
    //       name: fullAgent?.draft?.name ? fullAgent?.draft?.name : fullAgent?.name,
    //       description: fullAgent?.draft?.description
    //         ? fullAgent?.draft?.description
    //         : fullAgent?.description,
    //       icon_url: fullAgent?.draft?.icon_url
    //         ? fullAgent?.draft?.icon_url
    //         : fullAgent.icon_url || null,
    //       personality_type: fullAgent?.draft?.personality_type
    //         ? fullAgent?.draft?.personality_type
    //         : fullAgent?.personality_type,
    //       verbose: fullAgent?.draft?.verbose
    //         ? fullAgent?.draft?.verbose
    //         : fullAgent?.draft?.verbose,
    //     });
    //   }
    // }, [fullAgent]);
  
    useEffect(() => {
      fetchNumbers();
    }, []);
    // const fullPhoneNumber = `${selectedCountryCode}${phoneNumber}`;
    const handleVerify = async () => {
      setVerfyLoading(true);
      try {
        // const result = await 
        // axios.post(
        //   `${URL}/dashboard/applications/${applicationId}/session/connect`,
        //   {
        //     phone_number: fullPhoneNumber,
        //   },
        //   {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //       "Content-Type": "application/json",
        //     },
        //   }
        // );
        // setVerfyLoading(false);
        // setPhoneNumber("");
        fetchNumbers();
      } catch (error) {
        // setVerfyLoading(false);
        console.error("Error updating data:", error);
      }
    };
  
    const location = useLocation();
  
  
    const handleSwitchChange = (isChecked) => {
      // setEnabled(isChecked);
    //   setDeactivateAppModal(true);
    };
  
  
    const saveChanges = () => {
      handleSave();
    //   setIsFormModified(false);
    //   setTimeout(() => {
    //     setShowUnsavedSettingsModal(false);
    //   }, 1500)
    //   setReroute('');
    };
  
    const discardChanges = () => {
    //   setIsFormModified(false);
    //   setShowUnsavedSettingsModal(false);
    //   setActiveButton(reroute);
    //   setReroute("");
    };
  
    const closeModal = () => {
    //   setShowUnsavedSettingsModal(false);
    };
  
  
  
    return (
      <section className="mt-10 font-figtree ">
        <div className="flex gap-20 w-full mb-10">
          <aside className=" w-2/6">
            <h3 className=" text-sm font-medium">Description</h3>
            <p className="text-[#7F7F81] font-normal text-xs">
              Set a description and look for your assistant while it interacts with
              your customers
            </p>
          </aside>
          <aside className=" w-1/2">
            <h3 className="">Image</h3>
            <div className=" mt-3 flex gap-3 items-end">
              <div className="relative">
                <AgentProfilePicture />
                {selectedImage2 ? (
                  <img
                    src={selectedImage2}
                    alt="Uploaded"
                    className="absolute top-0 h-[40px] w-[40px] object-cover"
                  />
                ) : (
                  <img
                    src={data.icon_url || DefaultImage}
                    alt="Default"
                    className="absolute top-0 h-[40px] rounded-[6.4px] shadow-md w-[40px] object-cover"
                  />
                )}
              </div>
              <div className=" relative">
                <label htmlFor="choosefile" className=" cursor-pointer">
                  <ChooseFileBtn />
                </label>
                <input
                  type="file"
                  name=""
                  onChange={handleImageChange}
                  id="choosefile"
                  className=" hidden"
                  accept="image/*"
                />
              </div>
            </div>
            <div className=" mt-6">
              <p className="text-[#101828] text-xs font-normal">Name</p>
              <input
                type="text"
                className=" w-[420px] mt-3 outline-none h-9"
                value={data?.name}
                onChange={(e) => {
                  setData((prevData) => ({
                    ...prevData,
                    name: e.target.value,
                  }));
                //   setIsFormModified(true);
                }}
              />
              <div className="flex flex-col my-[24px]  gap-[12px]">
                <p className="text-xs text-[#121212] font-normal">
                  Category
                </p>
                <div className=" relative flex items-center w-[420px] border rounded-xl">
                  <input
                    type="text"
                    value={newagentType ? newagentType : agentType}
                    readOnly
                    className=" border-none outline-none " // h-10 pr-[75px]
                  />
                  <div
                    onClick={() => setOpenAgentCategory(true)}
                    className="  mr-2 cursor-pointer" //absolute top-[4px] right-2
                  >
                    <ChangeIcon />
                  </div>
                </div>
              </div>
              <p className="mt-6 text-[#101828] text-xs font-normal mb-3">
                Description
              </p>
              <textarea
                name=""
                id=""
                cols={50}
                rows={4}
                className=" outline-none rounded-lg border border-[#D0D5DD] p-1"
                value={data?.description}
                onChange={(e) => {
                  setData((prevData) => ({
                    ...prevData,
                    description: e.target.value,
                  }));
                //   setIsFormModified(true);
                }}
              ></textarea>
            </div>
          </aside>
        </div>
        <hr className=" w-[830px] my-[50px]" />
        {("Sales" === "Sales" || "Sales" === "Customer Service") && (
          <section>
            <section className="flex gap-20 w-full mb-10">
              <div className=" w-2/6">
                <p className=" text-xs font-medium">Personality</p>
                <p className="text-[#7F7F81] text-xs font-normal">
                  Select a Personality for your assistant, you can change this
                  whenever you want
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs font-normal">Personality</p>
                <div className=" relative">
                  <input
                    type="text"
                    value={
                      data?.personality_type?.split("-")?.join(" ") ||
                      selectedPersonality?.split("-")?.join(" ") ||
                      ""
                    }
                    readOnly
                    className="capitalize w-[420px] outline-none h-10 pr-[75px]"
                  />
                  <div
                    onClick={() => setShowPersonalityModal(true)}
                    className=" absolute top-[4px] right-2 cursor-pointer"
                  >
                    <ChooseIcon />
                  </div>
                </div>
              </div>
            </section>
            <hr className=" w-[830px] my-[50px]" />
            <section className="flex gap-20 w-full mb-10">
              <div className=" w-2/6">
                <p className=" text-xs font-medium">Verbosity</p>
                <p className="text-[#7F7F81] text-xs font-normal">
                  Adjust Assistant’s response detail or word’s used
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs font-normal">Choose Verbosity level</p>
                <div className=" relative">
                  <input
                    type="text"
                    value={data?.verbose || selectedVerbosity}
                    readOnly
                    className="capitalize w-[420px] outline-none h-10 pr-[75px]"
                  />
                  <div
                    onClick={() => setShowWordinessModal(true)}
                    className=" absolute top-[4px] right-2 cursor-pointer"
                  >
                    <ChooseIcon />
                  </div>
                </div>
              </div>
            </section>
            <hr className=" w-[830px] my-[50px]" />
            <section className="flex  w-full mb-10">
              <div className="flex w-full gap-20  items-center">
                <div className="w-2/6 flex flex-col">
                  <p className="text-sm text-BLACK-_100 font-medium">
                    Deactivate Assistant
                  </p>
                  <p className="text-sm text-[#7F7F81]">
                    Set your assistant as inactive. This prevents your customers
                    from interacting with the Assistant.
                  </p>
                </div>
                <div>
                  <Switch
                    checked={fullAgent.deactivated}
                    onChange={handleSwitchChange}
                    as={Fragment}
                  >
                    {({ checked }) => (
                      /* Use the `checked` state to conditionally style the button.  mb-[180px]*/
                      <button
                        className={`${
                          checked
                            ? "bg-blue-600"
                            : enabled
                            ? "bg-blue-600"
                            : "bg-gray-200"
                        } relative inline-flex h-6 w-11 items-center rounded-full`}
                      >
                        <span className="sr-only">Enable notifications</span>
                        <span
                          className={`${
                            checked
                              ? "translate-x-6"
                              : enabled
                              ? "translate-x-6"
                              : "translate-x-1"
                          } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                        />
                      </button>
                    )}
                  </Switch>
                </div>
              </div>
            </section>
            <hr className=" w-[830px] my-[50px]" />
          </section>
        )}
        {/* <TestAgent activeButton={activeButton} setActiveButton={setActiveButton}/> */}
        <button
          disabled={!isFormModified || loading}
          onClick={() => handleSave()}
          className={`bg-[#121212] text-white text-sm font-semibold py-[11px] w-[140px] rounded-lg absolute top-0 right-0 ${
            isFormModified ? " cursor-pointer" : " cursor-not-allowed"
          }`}
        >
          {loading ? (
            <span className="flex justify-center w-full">
              <CgSpinner className=" animate-spin text-lg " />
            </span>
          ) : (
            <span>Save Changes</span>
          )}
        </button>

        {/* <ModalPop isOpen={showPersonalityModal}>
          <PersonalityModal
            handleClose={() => setShowPersonalityModal(false)}
            handleSavePersonality={handleSavePersonality}
            selectedPersonality={selectedPersonality}
          />
        </ModalPop>
        <ModalPop isOpen={showWordinessModal}>
          <WordinessLevelModal
            handleClose={() => setShowWordinessModal(false)}
            handleVerbosity={handleVerbosity}
            selectedVerbosity={selectedVerbosity}
          />
        </ModalPop>
        <ModalPop isOpen={deleteAppModal}>
          <DeleteAppModal
            handleClose={async () => {
              const res = await dispatch(getApplicationById());
              if (res.payload.data.length) {
                await dispatch(getAnEmployee({ id: res.payload.data[0].id }));
                localStorage.setItem(
                  "wano_agent",
                  JSON.stringify(res.payload.data[0])
                ); //added this
              }
              setDeleteAppModal(false);
            }}
            justCloseModal={() => {
              setDeleteAppModal(false);
            }}
            fetchData={fetchData}
            appID={applicationId}
          />
        </ModalPop>
        <ModalPop isOpen={deactivateAppModal}>
          <DeactivateAppModal
            handleClose={() => {
              setDeactivateAppModal(false);
              dispatch(getApplicationById());
  
              dispatch(getAnEmployee({ id: fullAgent.id }));
            }}
          />
        </ModalPop>
        <ModalPop isOpen={showSaveChangesModal}>
          <SaveChanges handleClose={() => setShowSaveChangesModal(false)} />
        </ModalPop>
        <ModalPop isOpen={showUnsavedSettingsModal}>
          <UnsavedSettings
            handleClose={discardChanges}
            handleSave={() => {
              saveChanges();
            }}
            close={() => closeModal()}
            loading={loading}
          />
        </ModalPop>
        <ModalPop isOpen={openAgentCategory}>
          <SwitchAgentRole
            handleClose={() => setOpenAgentCategory(false)}
            setChange={setChange}
          />
        </ModalPop>
        <ModalPop isOpen={openConfirmModal}>
          <ConfirmSwitch
            handleClose={async() => {setOpenConfirmModal(false)
            // 'get correct role'
              const res = await dispatch(getApplicationById());
              if (res.payload.data.length) {
                await dispatch(getAnEmployee({ id: res.payload.data[0].id }));
                localStorage.setItem(
                  "wano_agent",
                  JSON.stringify(res.payload.data[0])
                ); //added this
              }
            }}
            setChange={setChange}
          />
        </ModalPop> */}
      </section>
    );
  }
  