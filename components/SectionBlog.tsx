import { date } from "zod"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"

const SectionBlog: React.FC = () => {
    const data = [
        {
            category: "Bussiness",
            date: ' 30 Jan 2025 - 5 mins read',
            img: '/rectangle-34624278-3.png',
        },
        {
            category: "Bussiness",
            date: ' 30 Jan 2025 - 5 mins read',
            img: '/rectangle-34624278-3.png',
        },
        {
            category: "Bussiness",
            date: ' 30 Jan 2025 - 5 mins read',
            img: '/rectangle-34624278-3.png',
        }
    ]
    return (
        <section className="flex flex-col mx-40 mb-6 items-center py-8">
            <h2 className="font-semibold text-[#0d0d12] text-[28px] leading-[39.2px] [font-family:'Poppins',Helvetica] tracking-[0] mb-3">
                Blog
            </h2>
            <p className="font-normal text-[#808897] text-xl text-center leading-[28.4px] [font-family:'Poppins',Helvetica] tracking-[0]">
                Here, We share business tips and other useful information
            </p>

            <div className="w-full grid grid-cols-3 gap-6 mt-10 ">
                {data.map((item, i) => (
                    <Card key={i} className="w-[374px] h-[353px] border-none bg-transparent shadow-none">
                        <CardContent className="p-0 relative">
                            <div className="relative">
                                <img
                                    className="w-[368px] h-60 rounded-[10px] border border-solid border-[#a4abb866] object-cover"
                                    alt="Rectangle"
                                    src={item.img}
                                />

                                <Badge
                                    variant="secondary"
                                    className="absolute top-[18px] left-[18px] w-[108px] h-[42px] bg-white rounded-[10px] border border-solid border-[#a4abb866] flex items-center justify-center [font-family:'Poppins',Helvetica] font-medium text-sm text-[#0d0d12] tracking-[0] leading-[19.6px]"
                                >
                                    {item.category}
                                </Badge>
                            </div>

                            <div className="mt-[26px] space-y-2">
                                <div className="[font-family:'Poppins',Helvetica] font-normal text-[#808897] text-sm tracking-[0] leading-[normal] whitespace-nowrap">
                                    {item.date}
                                </div>

                                <h3 className="[font-family:'Poppins',Helvetica] font-semibold text-[#0d0d12] text-[22px] tracking-[0] leading-[normal] whitespace-nowrap">
                                    Business Tips
                                </h3>

                                <p className="w-[368px] [font-family:'Poppins',Helvetica] font-normal text-[#808897] text-base tracking-[0] leading-[22.7px]">
                                    Behind every successful business is a clear, actionable plan.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))
                }
            </div>
        </section>
    )
}

export default SectionBlog