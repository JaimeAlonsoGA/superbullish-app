import faqs from "../../assets/data/faq.json";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from '@/components/ui/accordion';

const FAQ = () => {
    return (
        <section className="flex flex-col" aria-label="Frequently asked questions about Web3 videos">
            <div className="text-center mb-8">
                <h2 className="text-foreground mb-6">Web3 Video FAQ</h2>
                <p className="text-muted">
                    Everything you need to know about our blockchain video creation service
                </p>
            </div>

            <Accordion type="single" collapsible>
                {faqs.map((faq, index) => (
                    <AccordionItem
                        key={index}
                        value={`item-${index}`}
                    >
                        <AccordionTrigger
                            aria-controls={`faq-answer-${index}`}
                            className="text-lg"
                        >
                            <span className="pr-4">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent
                            id={`faq-answer-${index}`}
                            className="px-4 sm:px-6 pb-3 sm:pb-4 text-sm sm:text-base text-muted leading-relaxed"
                        >
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </section>
    )
}

export default FAQ;