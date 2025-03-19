import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  BookOpen,
  Clock,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Code,
  PlayCircle,
  FileText,
  CheckCircle,
  X,
} from "lucide-react";
import ReactMarkdown from 'react-markdown'


const Lesson = () => {

  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("content");
  const [selectedExample, setSelectedExample] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchLessonDetails = async () => {
      try {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockLessons = [
          {
            _id: 101,
            title: "Introduction to JavaScript",
            courseId: "1",
            courseName: "JavaScript Fundamentals",
            content: `Lesson 1: Introduction to JavaScript

### **What is JavaScript?**
JavaScript is a programming language used to create interactive websites.
It can modify HTML, CSS, and handle user actions.

Why Learn JavaScript?

- Works in all modern browsers
- Essential for web development
- Used for both frontend and backend
- Supports different programming styles
How to Run JavaScript?

- Browser Console (Press F12 and go to the Console tab).
- Inside an HTML file

\`
<script>
console.log("Hello, JavaScript!");
</script>

- External JavaScript file (.js file)

<script src="script.js"></script>

Basic JavaScript Rules:

- JavaScript is case-sensitive.
- Statements end with a semicolon (;).
- Comments help explain code:
\`
// This is a single-line comment

/* This is a multi-line comment */

Displaying Output:


console.log("Hello, World!"); // Shows message in console
alert("Welcome to JavaScript!"); // Shows popup alert


Declaring Variables:

JavaScript has three ways to declare variables:

  

\
let name = "John"; // Can change value
const age = 25; // Cannot change value
var score = 100; // Old method (not recommended)
\`
`,
            order: 2,
            duration: 15,
            codeExamples: [
              {
                id: "1",
                title: "Variable Declaration",
                code: `// Different ways to declare variables
            let name = "John";
            const age = 25;
            var score = 100;
            
            // Let allows reassignment
            name = "Jane";

            // Const prevents reassignment
            // age = 26; // This would cause an error
            
            console.log(name, age, score);`,
                explanation:
                  "This example shows the different ways to declare variables in JavaScript and demonstrates the difference between let, const, and var.",
              },
              {
                id: "2",
                title: "Data Types Example",
                code: `// Primitive types
            let string = "Hello";
            let number = 42;
            let boolean = true;
            let undefinedVar;
            let nullVar = null;
            let symbol = Symbol('description');
            let bigInt = BigInt(9007199254740991);
            
            // Complex types
            let array = [1, 2, 3];
            let object = { name: "John", age: 25 };
            let function = () => console.log("Hello!");
            
            // Check types
            console.log(typeof string);    // "string"
            console.log(typeof number);    // "number"
            console.log(typeof boolean);   // "boolean"
            console.log(typeof array);     // "object"
            console.log(typeof object);    // "object"
            console.log(typeof function);  // "function"`,
                explanation:
                  "This example demonstrates all the different data types available in JavaScript and how to check their types using the typeof operator.",
              },
              {
                id: "3",
                title: "Type Coercion",
                code: `// Automatic type conversion
            console.log(5 + "10");     // "510" (string concatenation)
            console.log(5 - "3");      // 2 (numeric subtraction)
            console.log("5" * "3");    // 15 (numeric multiplication)
            console.log(5 + true);     // 6 (true is converted to 1)
            console.log(5 + false);    // 5 (false is converted to 0)
            console.log("5" + true);   // "5true" (string concatenation)
            
            // Explicit type conversion
            console.log(Number("5"));  // 5
            console.log(String(5));    // "5"
            console.log(Boolean(5));   // true`,
                explanation:
                  "This example shows how JavaScript automatically converts between different types (type coercion) and how to explicitly convert between types.",
              },
            ],
            resources: [
              {
                title: "MDN: JavaScript Data Types",
                url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures",
                type: "documentation",
              },
              {
                title: "Variables and Data Types in JavaScript",
                url: "https://www.youtube.com/watch?v=example",
                type: "video",
              },
            ],
            quiz: {
              id: "201",
              title: "Variables and Data Types Quiz",
            },
            nextLesson: { id: "102", title: "Variables and Data Types" },
          },
          {
            _id: 102,
            title: "Variables and Data Types",
            courseId: "1",
            courseName: "JavaScript Fundamentals",
            duration: 25,
            content: `

**Variables and Data Types in JavaScript**  




### **What are Variables?**  
Variables are used to store data in JavaScript. They act as containers for values.  

### **Declaring Variables**  
JavaScript provides three ways to declare variables:  

1. **let** - Allows reassignment.  
   \`let name = "John";  
2. **const** - Cannot be reassigned.  
   \`const age = 25;  
3. **var** - Older way, function-scoped.  
   var score = 100;  

### **Data Types in JavaScript**  

JavaScript has two main types of data: **Primitive** and **Non-Primitive (Reference Types).**  

#### **1. Primitive Data Types** (Stores single values)  
- **String**: "Hello, World!"  
- **Number**: 42, 3.14  
- **Boolean**: true, false  
- **Undefined**: A variable with no value (\`let x;\`)  
- **Null**: A variable with an empty value (\`let y = null;\`)  
- **Symbol**: Unique and immutable values (\`Symbol("id")\`)  
- **BigInt**: Large integers (\`BigInt(12345678901234567890)\`)  

#### **2. Non-Primitive (Reference) Data Types** (Stores collections of data)  
- **Array**: [1, 2, 3, "hello"]  
- **Object**: { name: "John", age: 25 }  
- **Function**: function greet() { console.log("Hi!"); }  

### **Checking Data Types**  
You can check a variable’s type using typeof:  


console.log(typeof "Hello"); // "string"
console.log(typeof 42);      // "number"
console.log(typeof true);    // "boolean"
console.log(typeof []);      // "object" (Arrays are objects)
console.log(typeof {});      // "object"
console.log(typeof function() {}); // "function"
\`\`\`  

This helps in debugging and ensures you are using the correct data type in your code.

---

`,

            order: 2,
            resources: [
              {
                title: "MDN: JavaScript Data Types",
                url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures",
                type: "documentation",
              },
              {
                title: "Variables and Data Types in JavaScript",
                url: "https://www.youtube.com/watch?v=example",
                type: "video",
              },
            ],
            previousLesson: { id: "101", title: "Introduction to JavaScript" },
            quiz: {
              id: "201",
              title: "Variables and Data Types Quiz",
            },
            nextLesson: { id: "103", title: "Operators and Expressions" },
          },
          {
            _id: 103,
            title: "Operators and Expressions",
            courseId: "1",
            courseName: "JavaScript Fundamentals",
            duration: 20,
            content: ` `,
            order: 2,
            codeExamples: [
              {
                id: "1",
                title: "Variable Declaration",
                code: `// Different ways to declare variables
            let name = "John";
            const age = 25;
            var score = 100;
            
            // Let allows reassignment
            name = "Jane";
            
            // Const prevents reassignment
            // age = 26; // This would cause an error
            
            console.log(name, age, score);`,
                explanation:
                  "This example shows the different ways to declare variables in JavaScript and demonstrates the difference between let, const, and var.",
              },
              {
                id: "2",
                title: "Data Types Example",
                code: `// Primitive types
            let string = "Hello";
            let number = 42;
            let boolean = true;
            let undefinedVar;
            let nullVar = null;
            let symbol = Symbol('description');
            let bigInt = BigInt(9007199254740991);
            
            // Complex types
            let array = [1, 2, 3];
            let object = { name: "John", age: 25 };
            let function = () => console.log("Hello!");
            
            // Check types
            console.log(typeof string);    // "string"
            console.log(typeof number);    // "number"
            console.log(typeof boolean);   // "boolean"
            console.log(typeof array);     // "object"
            console.log(typeof object);    // "object"
            console.log(typeof function);  // "function"`,
                explanation:
                  "This example demonstrates all the different data types available in JavaScript and how to check their types using the typeof operator.",
              },
              {
                id: "3",
                title: "Type Coercion",
                code: `// Automatic type conversion
            console.log(5 + "10");     // "510" (string concatenation)
            console.log(5 - "3");      // 2 (numeric subtraction)
            console.log("5" * "3");    // 15 (numeric multiplication)
            console.log(5 + true);     // 6 (true is converted to 1)
            console.log(5 + false);    // 5 (false is converted to 0)
            console.log("5" + true);   // "5true" (string concatenation)
            
            // Explicit type conversion
            console.log(Number("5"));  // 5
            console.log(String(5));    // "5"
            console.log(Boolean(5));   // true`,
                explanation:
                  "This example shows how JavaScript automatically converts between different types (type coercion) and how to explicitly convert between types.",
              },
            ],
            resources: [
              {
                title: "MDN: JavaScript Data Types",
                url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures",
                type: "documentation",
              },
              {
                title: "Variables and Data Types in JavaScript",
                url: "https://www.youtube.com/watch?v=example",
                type: "video",
              },
            ],
            previousLesson: { id: "102", title: "Variables and Data Types" },
            quiz: {
              id: "201",
              title: "Variables and Data Types Quiz",
            },
            nextLesson: { id: "104", title: "Control Flow: Conditionals" },
          },
          {
            _id: 104,
            title: "Control Flow: Conditionals",
            courseId: "1",
            courseName: "JavaScript Fundamentals",
            duration: 30,
            content: ` `,
            order: 2,
            codeExamples: [
              {
                id: "1",
                title: "Variable Declaration",
                code: `// Different ways to declare variables
            let name = "John";
            const age = 25;
            var score = 100;
            
            // Let allows reassignment
            name = "Jane";
            
            // Const prevents reassignment
            // age = 26; // This would cause an error
            
            console.log(name, age, score);`,
                explanation:
                  "This example shows the different ways to declare variables in JavaScript and demonstrates the difference between let, const, and var.",
              },
              {
                id: "2",
                title: "Data Types Example",
                code: `// Primitive types
            let string = "Hello";
            let number = 42;
            let boolean = true;
            let undefinedVar;
            let nullVar = null;
            let symbol = Symbol('description');
            let bigInt = BigInt(9007199254740991);
            
            // Complex types
            let array = [1, 2, 3];
            let object = { name: "John", age: 25 };
            let function = () => console.log("Hello!");
            
            // Check types
            console.log(typeof string);    // "string"
            console.log(typeof number);    // "number"
            console.log(typeof boolean);   // "boolean"
            console.log(typeof array);     // "object"
            console.log(typeof object);    // "object"
            console.log(typeof function);  // "function"`,
                explanation:
                  "This example demonstrates all the different data types available in JavaScript and how to check their types using the typeof operator.",
              },
              {
                id: "3",
                title: "Type Coercion",
                code: `// Automatic type conversion
            console.log(5 + "10");     // "510" (string concatenation)
            console.log(5 - "3");      // 2 (numeric subtraction)
            console.log("5" * "3");    // 15 (numeric multiplication)
            console.log(5 + true);     // 6 (true is converted to 1)
            console.log(5 + false);    // 5 (false is converted to 0)
            console.log("5" + true);   // "5true" (string concatenation)
            
            // Explicit type conversion
            console.log(Number("5"));  // 5
            console.log(String(5));    // "5"
            console.log(Boolean(5));   // true`,
                explanation:
                  "This example shows how JavaScript automatically converts between different types (type coercion) and how to explicitly convert between types.",
              },
            ],
            resources: [
              {
                title: "MDN: JavaScript Data Types",
                url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures",
                type: "documentation",
              },
              {
                title: "Variables and Data Types in JavaScript",
                url: "https://www.youtube.com/watch?v=example",
                type: "video",
              },
            ],
            previousLesson: { id: "103", title: "Operators and Expressions" },
            quiz: {
              id: "201",
              title: "Variables and Data Types Quiz",
            },
            nextLesson: { id: "105", title: "Control Flow: Loops" },
          },
          {
            _id: 105,
            title: "Control Flow: Loops",
            courseId: "1",
            courseName: "JavaScript Fundamentals",
            duration: 25,
            content: ` `,
            order: 2,
            codeExamples: [
              {
                id: "1",
                title: "Variable Declaration",
                code: `// Different ways to declare variables
            let name = "John";
            const age = 25;
            var score = 100;
            
            // Let allows reassignment
            name = "Jane";
            
            // Const prevents reassignment
            // age = 26; // This would cause an error
            
            console.log(name, age, score);`,
                explanation:
                  "This example shows the different ways to declare variables in JavaScript and demonstrates the difference between let, const, and var.",
              },
              {
                id: "2",
                title: "Data Types Example",
                code: `// Primitive types
            let string = "Hello";
            let number = 42;
            let boolean = true;
            let undefinedVar;
            let nullVar = null;
            let symbol = Symbol('description');
            let bigInt = BigInt(9007199254740991);
            
            // Complex types
            let array = [1, 2, 3];
            let object = { name: "John", age: 25 };
            let function = () => console.log("Hello!");
            
            // Check types
            console.log(typeof string);    // "string"
            console.log(typeof number);    // "number"
            console.log(typeof boolean);   // "boolean"
            console.log(typeof array);     // "object"
            console.log(typeof object);    // "object"
            console.log(typeof function);  // "function"`,
                explanation:
                  "This example demonstrates all the different data types available in JavaScript and how to check their types using the typeof operator.",
              },
              {
                id: "3",
                title: "Type Coercion",
                code: `// Automatic type conversion
            console.log(5 + "10");     // "510" (string concatenation)
            console.log(5 - "3");      // 2 (numeric subtraction)
            console.log("5" * "3");    // 15 (numeric multiplication)
            console.log(5 + true);     // 6 (true is converted to 1)
            console.log(5 + false);    // 5 (false is converted to 0)
            console.log("5" + true);   // "5true" (string concatenation)
            
            // Explicit type conversion
            console.log(Number("5"));  // 5
            console.log(String(5));    // "5"
            console.log(Boolean(5));   // true`,
                explanation:
                  "This example shows how JavaScript automatically converts between different types (type coercion) and how to explicitly convert between types.",
              },
            ],
            resources: [
              {
                title: "MDN: JavaScript Data Types",
                url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures",
                type: "documentation",
              },
              {
                title: "Variables and Data Types in JavaScript",
                url: "https://www.youtube.com/watch?v=example",
                type: "video",
              },
            ],
            previousLesson: { id: "104", title: "Control Flow: Conditionals" },
            quiz: {
              id: "201",
              title: "Variables and Data Types Quiz",
            },
            nextLesson: { id: "106", title: "Functions" },
          },
          {
            _id: 106,
            title: "Functions",
            courseId: "1",
            courseName: "JavaScript Fundamentals",
            duration: 35,
            content: ` `,
            order: 2,
            codeExamples: [
              {
                id: "1",
                title: "Variable Declaration",
                code: `// Different ways to declare variables
            let name = "John";
            const age = 25;
            var score = 100;
            
            // Let allows reassignment
            name = "Jane";
            
            // Const prevents reassignment
            // age = 26; // This would cause an error
            
            console.log(name, age, score);`,
                explanation:
                  "This example shows the different ways to declare variables in JavaScript and demonstrates the difference between let, const, and var.",
              },
              {
                id: "2",
                title: "Data Types Example",
                code: `// Primitive types
            let string = "Hello";
            let number = 42;
            let boolean = true;
            let undefinedVar;
            let nullVar = null;
            let symbol = Symbol('description');
            let bigInt = BigInt(9007199254740991);
            
            // Complex types
            let array = [1, 2, 3];
            let object = { name: "John", age: 25 };
            let function = () => console.log("Hello!");
            
            // Check types
            console.log(typeof string);    // "string"
            console.log(typeof number);    // "number"
            console.log(typeof boolean);   // "boolean"
            console.log(typeof array);     // "object"
            console.log(typeof object);    // "object"
            console.log(typeof function);  // "function"`,
                explanation:
                  "This example demonstrates all the different data types available in JavaScript and how to check their types using the typeof operator.",
              },
              {
                id: "3",
                title: "Type Coercion",
                code: `// Automatic type conversion
            console.log(5 + "10");     // "510" (string concatenation)
            console.log(5 - "3");      // 2 (numeric subtraction)
            console.log("5" * "3");    // 15 (numeric multiplication)
            console.log(5 + true);     // 6 (true is converted to 1)
            console.log(5 + false);    // 5 (false is converted to 0)
            console.log("5" + true);   // "5true" (string concatenation)
            
            // Explicit type conversion
            console.log(Number("5"));  // 5
            console.log(String(5));    // "5"
            console.log(Boolean(5));   // true`,
                explanation:
                  "This example shows how JavaScript automatically converts between different types (type coercion) and how to explicitly convert between types.",
              },
            ],
            resources: [
              {
                title: "MDN: JavaScript Data Types",
                url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures",
                type: "documentation",
              },
              {
                title: "Variables and Data Types in JavaScript",
                url: "https://www.youtube.com/watch?v=example",
                type: "video",
              },
            ],
            previousLesson: { id: "105", title: "Control Flow: Loops" },
            quiz: {
              id: "201",
              title: "Variables and Data Types Quiz",
            },
            nextLesson: { id: "107", title: "Objects and Arrays" },
          },
          {
            _id: 107,
            title: "Objects and Arrays",
            courseId: "1",
            courseName: "JavaScript Fundamentals",
            duration: 40,
            content: ` `,
            order: 2,
            codeExamples: [
              {
                id: "1",
                title: "Variable Declaration",
                code: `// Different ways to declare variables
            let name = "John";
            const age = 25;
            var score = 100;
            
            // Let allows reassignment
            name = "Jane";
            
            // Const prevents reassignment
            // age = 26; // This would cause an error
            
            console.log(name, age, score);`,
                explanation:
                  "This example shows the different ways to declare variables in JavaScript and demonstrates the difference between let, const, and var.",
              },
              {
                id: "2",
                title: "Data Types Example",
                code: `// Primitive types
            let string = "Hello";
            let number = 42;
            let boolean = true;
            let undefinedVar;
            let nullVar = null;
            let symbol = Symbol('description');
            let bigInt = BigInt(9007199254740991);
            
            // Complex types
            let array = [1, 2, 3];
            let object = { name: "John", age: 25 };
            let function = () => console.log("Hello!");
            
            // Check types
            console.log(typeof string);    // "string"
            console.log(typeof number);    // "number"
            console.log(typeof boolean);   // "boolean"
            console.log(typeof array);     // "object"
            console.log(typeof object);    // "object"
            console.log(typeof function);  // "function"`,
                explanation:
                  "This example demonstrates all the different data types available in JavaScript and how to check their types using the typeof operator.",
              },
              {
                id: "3",
                title: "Type Coercion",
                code: `// Automatic type conversion
            console.log(5 + "10");     // "510" (string concatenation)
            console.log(5 - "3");      // 2 (numeric subtraction)
            console.log("5" * "3");    // 15 (numeric multiplication)
            console.log(5 + true);     // 6 (true is converted to 1)
            console.log(5 + false);    // 5 (false is converted to 0)
            console.log("5" + true);   // "5true" (string concatenation)
            
            // Explicit type conversion
            console.log(Number("5"));  // 5
            console.log(String(5));    // "5"
            console.log(Boolean(5));   // true`,
                explanation:
                  "This example shows how JavaScript automatically converts between different types (type coercion) and how to explicitly convert between types.",
              },
            ],
            resources: [
              {
                title: "MDN: JavaScript Data Types",
                url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures",
                type: "documentation",
              },
              {
                title: "Variables and Data Types in JavaScript",
                url: "https://www.youtube.com/watch?v=example",
                type: "video",
              },
            ],
            previousLesson: { id: "106", title: "Functions" },
            quiz: {
              id: "201",
              title: "Variables and Data Types Quiz",
            },
            nextLesson: { id: "108", title: "DOM Manipulation" },
          },
          {
            _id: 108,
            title: "DOM Manipulation",
            courseId: "1",
            courseName: "JavaScript Fundamentals",
            duration: 45,
            content: ` `,
            order: 2,
            codeExamples: [
              {
                id: "1",
                title: "Variable Declaration",
                code: `// Different ways to declare variables
            let name = "John";
            const age = 25;
            var score = 100;
            
            // Let allows reassignment
            name = "Jane";
            
            // Const prevents reassignment
            // age = 26; // This would cause an error
            
            console.log(name, age, score);`,
                explanation:
                  "This example shows the different ways to declare variables in JavaScript and demonstrates the difference between let, const, and var.",
              },
              {
                id: "2",
                title: "Data Types Example",
                code: `// Primitive types
            let string = "Hello";
            let number = 42;
            let boolean = true;
            let undefinedVar;
            let nullVar = null;
            let symbol = Symbol('description');
            let bigInt = BigInt(9007199254740991);
            
            // Complex types
            let array = [1, 2, 3];
            let object = { name: "John", age: 25 };
            let function = () => console.log("Hello!");
            
            // Check types
            console.log(typeof string);    // "string"
            console.log(typeof number);    // "number"
            console.log(typeof boolean);   // "boolean"
            console.log(typeof array);     // "object"
            console.log(typeof object);    // "object"
            console.log(typeof function);  // "function"`,
                explanation:
                  "This example demonstrates all the different data types available in JavaScript and how to check their types using the typeof operator.",
              },
              {
                id: "3",
                title: "Type Coercion",
                code: `// Automatic type conversion
            console.log(5 + "10");     // "510" (string concatenation)
            console.log(5 - "3");      // 2 (numeric subtraction)
            console.log("5" * "3");    // 15 (numeric multiplication)
            console.log(5 + true);     // 6 (true is converted to 1)
            console.log(5 + false);    // 5 (false is converted to 0)
            console.log("5" + true);   // "5true" (string concatenation)
            
            // Explicit type conversion
            console.log(Number("5"));  // 5
            console.log(String(5));    // "5"
            console.log(Boolean(5));   // true`,
                explanation:
                  "This example shows how JavaScript automatically converts between different types (type coercion) and how to explicitly convert between types.",
              },
            ],
            resources: [
              {
                title: "MDN: JavaScript Data Types",
                url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures",
                type: "documentation",
              },
              {
                title: "Variables and Data Types in JavaScript",
                url: "https://www.youtube.com/watch?v=example",
                type: "video",
              },
            ],
            previousLesson: { id: "107", title: "Objects and Arrays" },
            quiz: {
              id: "201",
              title: "Variables and Data Types Quiz",
            },
            nextLesson: { id: "109", title: "Events" },
          },
          {
            _id: 109,
            title: "Events",
            courseId: "1",
            courseName: "JavaScript Fundamentals",
            duration: 30,
            content: ` `,
            order: 2,
            codeExamples: [
              {
                id: "1",
                title: "Variable Declaration",
                code: `// Different ways to declare variables
            let name = "John";
            const age = 25;
            var score = 100;
            
            // Let allows reassignment
            name = "Jane";
            
            // Const prevents reassignment
            // age = 26; // This would cause an error
            
            console.log(name, age, score);`,
                explanation:
                  "This example shows the different ways to declare variables in JavaScript and demonstrates the difference between let, const, and var.",
              },
              {
                id: "2",
                title: "Data Types Example",
                code: `// Primitive types
            let string = "Hello";
            let number = 42;
            let boolean = true;
            let undefinedVar;
            let nullVar = null;
            let symbol = Symbol('description');
            let bigInt = BigInt(9007199254740991);
            
            // Complex types
            let array = [1, 2, 3];
            let object = { name: "John", age: 25 };
            let function = () => console.log("Hello!");
            
            // Check types
            console.log(typeof string);    // "string"
            console.log(typeof number);    // "number"
            console.log(typeof boolean);   // "boolean"
            console.log(typeof array);     // "object"
            console.log(typeof object);    // "object"
            console.log(typeof function);  // "function"`,
                explanation:
                  "This example demonstrates all the different data types available in JavaScript and how to check their types using the typeof operator.",
              },
              {
                id: "3",
                title: "Type Coercion",
                code: `// Automatic type conversion
            console.log(5 + "10");     // "510" (string concatenation)
            console.log(5 - "3");      // 2 (numeric subtraction)
            console.log("5" * "3");    // 15 (numeric multiplication)
            console.log(5 + true);     // 6 (true is converted to 1)
            console.log(5 + false);    // 5 (false is converted to 0)
            console.log("5" + true);   // "5true" (string concatenation)
            
            // Explicit type conversion
            console.log(Number("5"));  // 5
            console.log(String(5));    // "5"
            console.log(Boolean(5));   // true`,
                explanation:
                  "This example shows how JavaScript automatically converts between different types (type coercion) and how to explicitly convert between types.",
              },
            ],
            resources: [
              {
                title: "MDN: JavaScript Data Types",
                url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures",
                type: "documentation",
              },
              {
                title: "Variables and Data Types in JavaScript",
                url: "https://www.youtube.com/watch?v=example",
                type: "video",
              },
            ],
            previousLesson: { id: "108", title: "DOM Manipulation" },
            quiz: {
              id: "201",
              title: "Variables and Data Types Quiz",
            },
            nextLesson: { id: "110", title: "Asynchronous JavaScript" },
          },
          {
            _id: 110,
            title: "Asynchronous JavaScript",
            courseId: "1",
            courseName: "JavaScript Fundamentals",
            duration: 50,
            content: ` `,
            order: 2,
            codeExamples: [
              {
                id: "1",
                title: "Variable Declaration",
                code: `// Different ways to declare variables
            let name = "John";
            const age = 25;
            var score = 100;
            
            // Let allows reassignment
            name = "Jane";
            
            // Const prevents reassignment
            // age = 26; // This would cause an error
            
            console.log(name, age, score);`,
                explanation:
                  "This example shows the different ways to declare variables in JavaScript and demonstrates the difference between let, const, and var.",
              },
              {
                id: "2",
                title: "Data Types Example",
                code: `// Primitive types
            let string = "Hello";
            let number = 42;
            let boolean = true;
            let undefinedVar;
            let nullVar = null;
            let symbol = Symbol('description');
            let bigInt = BigInt(9007199254740991);
            
            // Complex types
            let array = [1, 2, 3];
            let object = { name: "John", age: 25 };
            let function = () => console.log("Hello!");
            
            // Check types
            console.log(typeof string);    // "string"
            console.log(typeof number);    // "number"
            console.log(typeof boolean);   // "boolean"
            console.log(typeof array);     // "object"
            console.log(typeof object);    // "object"
            console.log(typeof function);  // "function"`,
                explanation:
                  "This example demonstrates all the different data types available in JavaScript and how to check their types using the typeof operator.",
              },
              {
                id: "3",
                title: "Type Coercion",
                code: `// Automatic type conversion
            console.log(5 + "10");     // "510" (string concatenation)
            console.log(5 - "3");      // 2 (numeric subtraction)
            console.log("5" * "3");    // 15 (numeric multiplication)
            console.log(5 + true);     // 6 (true is converted to 1)
            console.log(5 + false);    // 5 (false is converted to 0)
            console.log("5" + true);   // "5true" (string concatenation)
            
            // Explicit type conversion
            console.log(Number("5"));  // 5
            console.log(String(5));    // "5"
            console.log(Boolean(5));   // true`,
                explanation:
                  "This example shows how JavaScript automatically converts between different types (type coercion) and how to explicitly convert between types.",
              },
            ],
            resources: [
              {
                title: "MDN: JavaScript Data Types",
                url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures",
                type: "documentation",
              },
              {
                title: "Variables and Data Types in JavaScript",
                url: "https://www.youtube.com/watch?v=example",
                type: "video",
              },
            ],
            previousLesson: { id: "109", title: "Events" },
            quiz: {
              id: "201",
              title: "Variables and Data Types Quiz",
            },
            nextLesson: { id: "111", title: "Error Handling" },
          },
          {
            _id: 111,
            title: "Error Handling",
            courseId: "1",
            courseName: "JavaScript Fundamentals",
            duration: 20,
            content: ` `,
            order: 2,
            codeExamples: [
              {
                id: "1",
                title: "Variable Declaration",
                code: `// Different ways to declare variables
            let name = "John";
            const age = 25;
            var score = 100;
            
            // Let allows reassignment
            name = "Jane";
            
            // Const prevents reassignment
            // age = 26; // This would cause an error
            
            console.log(name, age, score);`,
                explanation:
                  "This example shows the different ways to declare variables in JavaScript and demonstrates the difference between let, const, and var.",
              },
              {
                id: "2",
                title: "Data Types Example",
                code: `// Primitive types
            let string = "Hello";
            let number = 42;
            let boolean = true;
            let undefinedVar;
            let nullVar = null;
            let symbol = Symbol('description');
            let bigInt = BigInt(9007199254740991);
            
            // Complex types
            let array = [1, 2, 3];
            let object = { name: "John", age: 25 };
            let function = () => console.log("Hello!");
            
            // Check types
            console.log(typeof string);    // "string"
            console.log(typeof number);    // "number"
            console.log(typeof boolean);   // "boolean"
            console.log(typeof array);     // "object"
            console.log(typeof object);    // "object"
            console.log(typeof function);  // "function"`,
                explanation:
                  "This example demonstrates all the different data types available in JavaScript and how to check their types using the typeof operator.",
              },
              {
                id: "3",
                title: "Type Coercion",
                code: `// Automatic type conversion
            console.log(5 + "10");     // "510" (string concatenation)
            console.log(5 - "3");      // 2 (numeric subtraction)
            console.log("5" * "3");    // 15 (numeric multiplication)
            console.log(5 + true);     // 6 (true is converted to 1)
            console.log(5 + false);    // 5 (false is converted to 0)
            console.log("5" + true);   // "5true" (string concatenation)
            
            // Explicit type conversion
            console.log(Number("5"));  // 5
            console.log(String(5));    // "5"
            console.log(Boolean(5));   // true`,
                explanation:
                  "This example shows how JavaScript automatically converts between different types (type coercion) and how to explicitly convert between types.",
              },
            ],
            resources: [
              {
                title: "MDN: JavaScript Data Types",
                url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures",
                type: "documentation",
              },
              {
                title: "Variables and Data Types in JavaScript",
                url: "https://www.youtube.com/watch?v=example",
                type: "video",
              },
            ],
            previousLesson: { id: "110", title: "Asynchronous JavaScript" },
            quiz: {
              id: "201",
              title: "Variables and Data Types Quiz",
            },
            nextLesson: { id: "112", title: "Final Project" },
          },
          {
            _id: 112,
            title: "Final Project",
            courseId: "1",
            courseName: "JavaScript Fundamentals",
            duration: 45,
            content: ` `,
            order: 2,
            codeExamples: [
              {
                id: "1",
                title: "Variable Declaration",
                code: `// Different ways to declare variables
            let name = "John";
            const age = 25;
            var score = 100;
            
            // Let allows reassignment
            name = "Jane";
            
            // Const prevents reassignment
            // age = 26; // This would cause an error
            
            console.log(name, age, score);`,
                explanation:
                  "This example shows the different ways to declare variables in JavaScript and demonstrates the difference between let, const, and var.",
              },
              {
                id: "2",
                title: "Data Types Example",
                code: `// Primitive types
            let string = "Hello";
            let number = 42;
            let boolean = true;
            let undefinedVar;
            let nullVar = null;
            let symbol = Symbol('description');
            let bigInt = BigInt(9007199254740991);
            
            // Complex types
            let array = [1, 2, 3];
            let object = { name: "John", age: 25 };
            let function = () => console.log("Hello!");
            
            // Check types
            console.log(typeof string);    // "string"
            console.log(typeof number);    // "number"
            console.log(typeof boolean);   // "boolean"
            console.log(typeof array);     // "object"
            console.log(typeof object);    // "object"
            console.log(typeof function);  // "function"`,
                explanation:
                  "This example demonstrates all the different data types available in JavaScript and how to check their types using the typeof operator.",
              },
              {
                id: "3",
                title: "Type Coercion",
                code: `// Automatic type conversion
            console.log(5 + "10");     // "510" (string concatenation)
            console.log(5 - "3");      // 2 (numeric subtraction)
            console.log("5" * "3");    // 15 (numeric multiplication)
            console.log(5 + true);     // 6 (true is converted to 1)
            console.log(5 + false);    // 5 (false is converted to 0)
            console.log("5" + true);   // "5true" (string concatenation)
            
            // Explicit type conversion
            console.log(Number("5"));  // 5
            console.log(String(5));    // "5"
            console.log(Boolean(5));   // true`,
                explanation:
                  "This example shows how JavaScript automatically converts between different types (type coercion) and how to explicitly convert between types.",
              },
            ],
            resources: [
              {
                title: "MDN: JavaScript Data Types",
                url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures",
                type: "documentation",
              },
              {
                title: "Variables and Data Types in JavaScript",
                url: "https://www.youtube.com/watch?v=example",
                type: "video",
              },
            ],
            quiz: {
              id: "201",
              title: "Variables and Data Types Quiz",
            },
            previousLesson: { id: "111", title: "Error Handling" },
          },
        ];

        // Convert lessonId to a number before searching
        const foundLesson = mockLessons.find(
          (lesson) => lesson._id === Number(id)
        );

        setLesson(foundLesson || null);
      } catch (error) {
        console.error("Error fetching lesson details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessonDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Lesson Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The lesson you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/dashboard"
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Lesson Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            //dp mapping of Lessons
            <h1 className="text-2xl font-bold mb-2">{lesson?.title}</h1>
            <p className="text-gray-600">
              {lesson?.courseName} • Lesson {lesson?.order}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-600">
              <Clock className="h-5 w-5 mr-1" />
              <span>{lesson?.duration} min</span>
            </div>
            <Link
              to={`/discussions/lesson=${lesson?._id}`}
              className="flex items-center text-indigo-600 hover:text-indigo-800"
            >
              <MessageSquare className="h-5 w-5 mr-1" />
              <span>Discussions</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Lesson Navigation */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center">
          {lesson?.previousLesson ? (
            <Link
              to={`/dashboard/lesson/${lesson?.previousLesson.id}`}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              <span>{lesson?.previousLesson.title}</span>
            </Link>
          ) : (
            <div></div>
          )}

          {lesson?.nextLesson && (
            <Link
              to={`/dashboard/lesson/${lesson?.nextLesson.id}`}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <span>{lesson?.nextLesson.title}</span>
              <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          )}
        </div>
      </div>

      {/* Lesson Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Content Tabs */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab("content")}
                  className={`py-4 px-6 text-sm font-medium ${
                    activeTab === "content"
                      ? "border-b-2 border-indigo-500 text-indigo-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <FileText className="h-5 w-5 inline mr-2" />
                  Lesson Content
                </button>
                <button
                  onClick={() => setActiveTab("examples")}
                  className={`py-4 px-6 text-sm font-medium ${
                    activeTab === "examples"
                      ? "border-b-2 border-indigo-500 text-indigo-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Code className="h-5 w-5 inline mr-2" />
                  Code Examples
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "content" ? (
                <div className="prose max-w-none">
                  {/* map content in html tags*/}
                  <ReactMarkdown>{lesson?.content}</ReactMarkdown>

                </div>
              ) : (
                <div className="space-y-6">
                  {lesson?.codeExamples.map((example) => (
                    <div
                      key={example.id}
                      className={`border rounded-lg p-4 ${
                        selectedExample === example.id
                          ? "border-indigo-500"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-medium">{example?.title}</h3>
                        <button
                          onClick={() =>
                            setSelectedExample(
                              selectedExample === example.id ? null : example.id
                            )
                          }
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          {selectedExample === example.id ? "Hide" : "Show"}{" "}
                          Explanation
                        </button>
                      </div>

                      <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                        <code>{example.code}</code>
                      </pre>

                      {selectedExample === example.id && (
                        <div className="mt-4 bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-md">
                          <p className="text-sm text-gray-800">
                            {example.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Your Progress</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Course Progress</span>
                <span className="font-medium">65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: "65%" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Additional Resources</h2>
            <div className="space-y-3">
              {lesson?.resources.map((resource, index) => (
                <div
                  key={index}
                  className="p-3 rounded-md hover:bg-gray-50 transition-colors"
                >
                  {resource.type === "video" ? (
                    <button
                      onClick={() => setSelectedVideo(resource.url)}
                      className="flex items-center w-full text-left"
                    >
                      <PlayCircle className="h-5 w-5 text-red-500 mr-3" />
                      <span className="text-gray-700 hover:text-gray-900">
                        {resource.title}
                      </span>
                    </button>
                  ) : (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <FileText className="h-5 w-5 text-blue-500 mr-3" />
                      <span className="text-gray-700 hover:text-gray-900">
                        {resource.title}
                      </span>
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Video Modal */}
            {selectedVideo && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg p-4 max-w-3xl w-full relative">
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                    onClick={() => setSelectedVideo(null)}
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <iframe
                    className="w-full h-64 sm:h-80 md:h-96 rounded-lg"
                    src={
                      "https://www.youtube.com/embed/ajdRvxDWH4w?si=-i9LPJHDEp2yMAtF"
                    }
                    title="YouTube Video"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Next Steps</h2>
            <div className="space-y-4">
              <Link
                to={`/dashboard/quiz/${lesson?.quiz.id}`}
                className="block w-full bg-indigo-600 text-white text-center py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Take Quiz
              </Link>

              {lesson?.nextLesson && (
                <Link
                  to={`/dashboard/lesson/${lesson?.nextLesson.id}`}
                  className="block w-full bg-gray-100 text-gray-700 text-center py-2 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Next Lesson: {lesson?.nextLesson.title}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lesson;
