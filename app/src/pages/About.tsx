import {TextCard} from "../components/TextCard.tsx";

export function About(){
    return (
        <>
            <TextCard title={"Main Information"} description={"Created by Alexis FROMENTIN and Mahmoud YOUSSEF for the course User Experience at Politechnika Wrocławska Copyright ©2025-2026"} />
            <TextCard title={"Technologies"} description={"Front-End: React.js with TypeScript\n" +
                "Back-End: Node.js with Express.js\n" +
                "Figma: Design of the web-application"} />
            <TextCard title={"Contact"} description={"Alexis FROMENTIN: darknocht@gmail.com\n" +
                "Mahmoud YOUSSEF: moelgendy2000@gmail.com\n"} />
        </>
    );
}