# ContextPin

> Ask questions about what you're reading — without leaving the context.

ContextPin is a lightweight, local-first Chrome extension that lets you ask contextual questions about any text directly where you encounter it.

Highlight a sentence, paragraph, or part of an AI-generated answer. ContextPin opens a small anchored interaction window, sends the selected text together with its surrounding context to your chosen LLM, and displays the response without taking you away from the page.

Every interaction is stored locally and connected to the context that produced it, gradually building a personal graph of questions, answers, explanations, and follow-ups.

## The Problem

Current AI assistants are mostly conversation-oriented.

You read something:

> The Jordan–Wigner transformation maps spin operators to fermionic operators.

You want to know:

> Why?

Today, the usual workflow is to copy the text, open an AI assistant, provide the context, ask the question, and move between two information spaces.

Browser assistants such as "Ask Gemini" reduce this friction, but the resulting conversation still lives in a separate AI interface.

ContextPin takes a different approach:

**The original content remains the primary interface.**

Questions and explanations appear as contextual layers attached to the content that triggered them.

## Core Interaction

```text
Read
 │
 ▼
Highlight text
 │
 ▼
Ask
 │
 ▼
Contextual popup
 │
 ├── Explain
 ├── Why?
 ├── Simplify
 └── Ask a question
 │
 ▼
Response
 │
 ▼
Stored locally
 │
 ▼
Connected to the existing context graph
```

## Example

Suppose an AI answer contains:

> The Jordan–Wigner transformation converts the spin Hamiltonian into a fermionic representation.

Highlight:

> Jordan–Wigner transformation

ContextPin displays:

```text
┌─────────────────────────────────┐
│ Jordan–Wigner transformation    │
│                                 │
│ Why is this useful here?        │
│                                 │
│ The transformation maps the     │
│ spin operators to fermionic     │
│ creation and annihilation       │
│ operators, allowing the model   │
│ to be rewritten as ...          │
│                                 │
│ ─────────────────────────────── │
│ Ask a follow-up...              │
└─────────────────────────────────┘
```

The user continues reading the original answer.

No new tab.
No separate chatbot.
No copying and pasting.

## Knowledge Graph

ContextPin does not require the user to manually take notes.

Interactions naturally form a graph:

```text
                 Original Answer
                       │
                       │ contains
                       ▼
                 [Hamiltonian]
                       │
                       │ question
                       ▼
              [Why this form?]
                       │
                       │ answered by
                       ▼
                  [Response]
                       │
                       │ follow-up
                       ▼
              [What about J=h?]
```

Over time:

```text
Physics
 │
 ├── Ising Model
 │    ├── Hamiltonian
 │    │    ├── Physical meaning
 │    │    └── Why this form?
 │    │
 │    ├── Jordan-Wigner
 │    │    ├── Fermionic mapping
 │    │    └── Boundary conditions
 │    │
 │    └── Phase transition
 │         ├── J = h
 │         └── Thermodynamic limit
 │
 └── Bogoliubov transformation
```

The graph is a consequence of interaction, not a separate note-taking task.

## Design Principles

### 1. Stay in context

The user should not have to leave the page to understand something on the page.

### 2. Local first

User data, interaction history, and API configuration should remain local by default.

### 3. Bring your own model

Users provide their own API keys.

Initial providers:

* OpenAI
* Anthropic
* Google Gemini

The architecture should make adding additional providers straightforward.

### 4. No forced organization

The user asks questions naturally.

ContextPin builds the relationships automatically.

### 5. Small surface area

ContextPin is not intended to become another general-purpose chatbot, RAG platform, or agent framework.

Its job is simple:

> **Make contextual questioning frictionless.**

## Architecture

```text
                    Browser Page
                         │
                         ▼
                 Chrome Content Script
                         │
                  selected text
                         │
                         ▼
                Context Extraction
                         │
             ┌───────────┴───────────┐
             ▼                       ▼
        Local Context            LLM Router
             │                       │
             │               ┌───────┼───────┐
             │               ▼       ▼       ▼
             │            OpenAI  Claude  Gemini
             │
             └──────────────┬──────────────┘
                            ▼
                     Interaction
                            │
                            ▼
                       Local Store
                            │
                            ▼
                     Context Graph
```

## Planned Stack

### Browser

* Chrome Extension
* Manifest V3
* TypeScript
* HTML/CSS

Chrome extensions use `manifest.json` as their root configuration and Manifest V3 is the current extension platform. Content scripts provide the mechanism for reading and modifying page DOM content.

### Storage

SQLite for local persistence.

The initial database will contain:

* sources
* contexts
* selections
* questions
* responses
* relationships
* provider/model metadata

### LLM Layer

Provider abstraction:

```text
LLMProvider
    │
    ├── OpenAIProvider
    ├── AnthropicProvider
    └── GeminiProvider
```

### Graph

The graph initially lives on top of the relational data rather than requiring a dedicated graph database.

This keeps the application small and portable.

A dedicated graph database is explicitly out of scope for the initial versions.

## MVP

The first usable version should do only five things:

1. Detect selected text.
2. Show an "Ask" action.
3. Extract useful surrounding context.
4. Query one configured LLM.
5. Display the response in an anchored popup.

After that works reliably, add local persistence.

Then add graph relationships.

Then add additional providers.

## Roadmap

### Phase 0 — Project skeleton

* [ ] Create repository
* [ ] Set up TypeScript
* [ ] Create Manifest V3 extension
* [ ] Load unpacked extension in Chrome
* [ ] Establish development workflow

### Phase 1 — Selection UX

* [ ] Detect text selection
* [ ] Determine selection coordinates
* [ ] Display small contextual action
* [ ] Build anchored popup
* [ ] Handle scrolling and viewport boundaries
* [ ] Support dismiss/reopen

### Phase 2 — Context extraction

* [ ] Capture selected text
* [ ] Capture surrounding paragraph
* [ ] Capture nearby paragraphs
* [ ] Capture page title
* [ ] Capture URL
* [ ] Detect basic page type
* [ ] Create normalized `Context` object

### Phase 3 — First LLM

Start with one provider.

* [ ] API key configuration
* [ ] Provider abstraction
* [ ] Contextual prompt construction
* [ ] Streaming response
* [ ] Error handling
* [ ] Token/cost visibility

### Phase 4 — Local persistence

* [ ] SQLite schema
* [ ] Store sources
* [ ] Store selections
* [ ] Store questions
* [ ] Store responses
* [ ] Store model metadata

### Phase 5 — Interaction graph

* [ ] Define node types
* [ ] Define edge types
* [ ] Automatically create relationships
* [ ] Link follow-up questions to parent interactions
* [ ] Link interactions to original source/context

### Phase 6 — Multiple providers

* [ ] OpenAI
* [ ] Anthropic
* [ ] Gemini
* [ ] Provider selection
* [ ] Optional multi-model comparison

### Phase 7 — Graph UI

* [ ] Local interaction history
* [ ] Search
* [ ] Graph visualization
* [ ] Click node → restore original context
* [ ] Follow interaction branches

## Initial Data Model

Conceptually:

```text
Source
 ├── id
 ├── url
 ├── title
 └── created_at

Context
 ├── id
 ├── source_id
 ├── selected_text
 ├── surrounding_text
 └── created_at

Question
 ├── id
 ├── context_id
 ├── text
 └── created_at

Response
 ├── id
 ├── question_id
 ├── provider
 ├── model
 ├── text
 └── created_at

Edge
 ├── id
 ├── source_node
 ├── target_node
 └── relationship
```

The exact schema will evolve during implementation.

## Privacy

ContextPin is designed to be local-first.

By default:

* API keys are stored locally.
* Interaction history is stored locally.
* The extension does not require a ContextPin account.
* Context is sent only to the LLM provider selected by the user.
* No ContextPin cloud backend is required for the core functionality.

Users should understand that selected text and surrounding context are sent to the configured LLM provider when they ask a question.

## Non-Goals

The following are intentionally outside the initial scope:

* Cloud synchronization
* User accounts
* Hosted databases
* RAG pipelines
* Autonomous agents
* Automatic web crawling
* Dedicated graph database
* Automatic note generation
* Full document management
* Replacing ChatGPT, Claude, or Gemini

## Status

**Early development — architecture and MVP planning.**

Nothing here should be considered stable API or data format yet.

## License

Apache 2.0
