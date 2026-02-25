import { Card, CardBody, CardFooter, Image } from "@heroui/react";
import { ShoppingCart } from "lucide-react";

const CardLicense = ({ license, onClick }) => {
    const imageUrl = license?.imgLicenses?.[0]?.urlImagen || "https://via.placeholder.com/300x200";

    return (
        <Card
            isPressable
            onPress={onClick}
            className="w-full border-none shadow-sm hover:shadow-lg transition-shadow"
        >
            <CardBody className="p-0 overflow-hidden">
                <div className="relative aspect-video">
                    <Image
                        removeWrapper
                        alt={license.name || "License Image"}
                        className="w-full h-full object-cover"
                        src={imageUrl}
                    />
                </div>
            </CardBody>
            <CardFooter className="flex-col items-start gap-2 p-4">
                <h4 className="font-semibold text-default-900 line-clamp-1">{license.name}</h4>
                <div className="flex items-center justify-between w-full">
                    <p className="text-xl font-bold text-primary">
                        ${license.price?.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-primary font-medium">
                        <ShoppingCart size={16} />
                        <span>Comprar</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};

export default CardLicense;