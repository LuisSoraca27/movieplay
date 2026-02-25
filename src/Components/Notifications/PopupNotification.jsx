import { useRef, useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Image, Tabs, Tab } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import {
    uploadImgPopup,
    getNotificationImgThunk,
    deleteImgPopup,
} from "../../features/notifications/notificationSlice";
import { addToast } from "@heroui/toast";
import FileUpload from "../ui/FileUpload";
import { Trash2, Link, Image as ImageIcon, Plus, X } from "lucide-react";

// eslint-disable-next-line react/prop-types
const PopupNotification = ({ visible, setVisible }) => {
    const dispatch = useDispatch();
    const { notificationImg } = useSelector((state) => state.notification);

    const [images, setImages] = useState([{ imagen: null, linkImg: "" }]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("list"); // "list" | "create"

    // Update view mode based on existing images
    useEffect(() => {
        setActiveTab(notificationImg.length > 0 ? "list" : "create");
    }, [notificationImg]);

    useEffect(() => {
        dispatch(getNotificationImgThunk());
    }, [dispatch]);

    const handleClose = () => {
        setVisible(false);
        setImages([{ imagen: null, linkImg: "" }]);
    };

    const handleRemoveImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
    };

    const handleDeleteImg = (id) => {
        setLoading(true);
        dispatch(deleteImgPopup(id))
            .then(() => {
                setLoading(false);
                addToast({ title: "Éxito", description: "Imagen eliminada correctamente", color: "success" });
            })
            .catch((error) => {
                setLoading(false);
                console.error(error);
                addToast({ title: "Error", description: "Error al eliminar imagen", color: "danger" });
            });
    };

    const onUploadImg = () => {
        setLoading(true);
        const formData = new FormData();
        images.forEach((image, index) => {
            if (image.imagen) {
                // Append each image file with the index-based field name
                formData.append(`image-${index}`, image.imagen);
                // Append the corresponding link for this image
                formData.append(`linkImg-${index}`, image.linkImg || '');
            }
        });

        // Debug: Log FormData contents (optional, can be removed)
        console.log('Uploading images:', images.length);
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        dispatch(uploadImgPopup(formData))
            .then(() => {
                setLoading(false);
                setImages([{ imagen: null, linkImg: "" }]);
                addToast({ title: "Éxito", description: "Imágenes subidas correctamente", color: "success" });
                setActiveTab("list");
            })
            .catch((error) => {
                setLoading(false);
                console.error('Upload error:', error);
                addToast({ title: "Error", description: "Error al subir imágenes", color: "danger" });
            });
    };

    return (
        <>
            <Modal
                isOpen={visible}
                onOpenChange={setVisible}
                size="2xl"
                scrollBehavior="inside"
                backdrop="blur"
                classNames={{
                    base: "bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl mx-4 my-8",
                    header: "border-b border-slate-100 pb-6 pt-8 px-10",
                    body: "py-8 px-10",
                    footer: "border-t border-slate-100 py-6 px-10"
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Notificación Emergente</h2>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                                    Gestión de visuales publicitarios y anuncios popup
                                </p>
                            </ModalHeader>
                            <ModalBody>
                                {/* Tabs Hybrid Premium (Segment Control) */}
                                <div className="flex justify-center mb-8">
                                    <Tabs
                                        radius="full"
                                        variant="light"
                                        selectedKey={activeTab}
                                        onSelectionChange={(key) => setActiveTab(key)}
                                        classNames={{
                                            tabList: "gap-4 p-1.5 bg-slate-200/40 backdrop-blur-md rounded-2xl w-fit border border-slate-200/60 shadow-inner-sm",
                                            cursor: "bg-slate-900 shadow-xl border border-slate-800",
                                            tab: "h-10 px-8",
                                            tabContent: "font-bold uppercase text-[11px] tracking-[0.15em] group-data-[selected=true]:text-white text-slate-500"
                                        }}
                                    >
                                        <Tab
                                            key="list"
                                            title="IMÁGENES ACTIVAS"
                                            startContent={<ImageIcon size={14} />}
                                        />
                                        <Tab
                                            key="create"
                                            title="NUEVA IMAGEN"
                                            startContent={<Plus size={14} />}
                                        />
                                    </Tabs>
                                </div>

                                {activeTab === "list" ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-4">
                                        {notificationImg.length === 0 ? (
                                            <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-300 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[2rem]">
                                                <ImageIcon size={48} className="opacity-50" />
                                                <p className="mt-4 font-bold uppercase tracking-widest text-[10px] text-slate-400">No hay imágenes activas</p>
                                                <Button
                                                    size="sm"
                                                    variant="flat"
                                                    className="mt-6 bg-slate-900 text-white font-bold uppercase tracking-wider text-[10px] h-10 px-6 rounded-xl shadow-md"
                                                    onPress={() => setActiveTab("create")}
                                                >
                                                    Agregar una
                                                </Button>
                                            </div>
                                        ) : (
                                            notificationImg.map((img, index) => (
                                                <div key={index} className="relative group rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 bg-white transition-all hover:shadow-lg hover:border-slate-200">
                                                    <Image
                                                        src={img.urlImagen}
                                                        alt="Notificación"
                                                        classNames={{
                                                            wrapper: "w-full h-52 object-cover",
                                                            img: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        }}
                                                    />
                                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                        <Button
                                                            isIconOnly
                                                            color="danger"
                                                            size="sm"
                                                            className="rounded-xl shadow-xl bg-red-500 text-white hover:bg-red-600 active:scale-90 transition-all border border-red-400"
                                                            onPress={() => handleDeleteImg(img.id)}
                                                            isLoading={loading}
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                    {img.linkImg && (
                                                        <div className="p-4 bg-slate-50 border-t border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate flex items-center gap-2">
                                                            <Link size={12} className="text-slate-400" />
                                                            {img.linkImg}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-8 pb-4">
                                        {images.map((img, index) => (
                                            <div key={index} className="p-8 border border-slate-200 rounded-[2rem] relative bg-white shadow-sm space-y-8 transition-all hover:border-slate-300">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                                                            {index + 1}
                                                        </div>
                                                        <span className="font-extrabold text-slate-900 tracking-tight text-lg">Subir Imagen</span>
                                                    </div>
                                                    {images.length > 1 && (
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            color="danger"
                                                            variant="light"
                                                            className="rounded-xl hover:bg-red-50 text-red-500 transition-all"
                                                            onPress={() => handleRemoveImage(index)}
                                                        >
                                                            <X size={16} />
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="space-y-8">
                                                    <FileUpload
                                                        onFileSelect={(file) => {
                                                            const newImages = [...images];
                                                            newImages[index].imagen = file;
                                                            setImages(newImages);
                                                        }}
                                                    />

                                                    <Input
                                                        label="ENLACE DE REDIRECCIÓN (OPCIONAL)"
                                                        labelPlacement="outside"
                                                        variant="underlined"
                                                        placeholder="https://tutienda.com/oferta"
                                                        startContent={<Link size={16} className="text-slate-400 mb-1" />}
                                                        value={img.linkImg}
                                                        classNames={{
                                                            label: "text-slate-400 font-bold tracking-wider text-[10px]",
                                                            input: "text-slate-800 font-semibold text-base py-2",
                                                            inputWrapper: "border-slate-200"
                                                        }}
                                                        onChange={(e) => {
                                                            const newImages = [...images];
                                                            newImages[index].linkImg = e.target.value;
                                                            setImages(newImages);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}

                                        <Button
                                            variant="flat"
                                            className="w-full bg-slate-50 border-2 border-dashed border-slate-200 text-slate-500 font-bold uppercase tracking-widest text-[10px] h-16 rounded-[2rem] hover:bg-slate-100 hover:border-slate-300 transition-all hover:scale-[1.01] active:scale-95 px-6"
                                            startContent={<Plus size={18} />}
                                            onPress={() => setImages([...images, { imagen: null, linkImg: "" }])}
                                        >
                                            Agregar otra imagen al lote
                                        </Button>
                                    </div>
                                )}
                            </ModalBody>
                            <ModalFooter className="gap-4">
                                <Button
                                    color="default"
                                    variant="light"
                                    className="font-bold uppercase tracking-widest text-[10px] text-slate-400 hover:text-slate-600 h-12 px-8 rounded-xl"
                                    onPress={handleClose}
                                >
                                    Cerrar Panel
                                </Button>
                                {activeTab === "create" && (
                                    <Button
                                        className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[11px] h-12 px-10 rounded-xl shadow-lg hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all"
                                        onPress={onUploadImg}
                                        isLoading={loading}
                                        isDisabled={images.some(img => !img.imagen)}
                                    >
                                        Guardar en el Sistema
                                    </Button>
                                )}
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default PopupNotification;
