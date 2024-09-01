import re

def parse_structs(file_content):
    struct_pattern = r'type\s+(\w+)\s+struct\s*{([^}]*)}'
    field_pattern = r'\s*(\w+)\s+([^`\n]+)'
    
    structs = {}
    for match in re.finditer(struct_pattern, file_content):
        struct_name = match.group(1)
        fields = re.findall(field_pattern, match.group(2))
        structs[struct_name] = fields
    
    return structs

def generate_erd(structs):
    erd = "Entity Relationship Diagram:\n\n"
    relationships = []

    for struct_name, fields in structs.items():
        erd += f"+------------------+\n"
        erd += f"|     {struct_name:<12} |\n"
        erd += f"+------------------+\n"
        for field_name, field_type in fields:
            erd += f"| {field_name:<16} |\n"
            if field_name.lower().endswith("id") and field_name.lower() != "id":
                related_entity = field_name[:-2]
                relationships.append((struct_name, related_entity))
                print(f"{struct_name} -> {related_entity}")
        erd += f"+------------------+\n\n"

    erd += "Relationships:\n"
    relationship_chain = {}
    for source, target in relationships:
        if source not in relationship_chain:
            relationship_chain[source] = set()
        relationship_chain[source].add(target)

    def draw_chain(entity, chain="", visited=None):
        if visited is None:
            visited = set()
        if entity in visited:
            return chain
        visited.add(entity)
        chain += f"{entity}"
        if entity in relationship_chain:
            for related in relationship_chain[entity]:
                chain = draw_chain(related, chain + " -> ", visited)
        return chain

    for start_entity in relationship_chain.keys():
        erd += draw_chain(start_entity) + "\n"

    return erd


# Read the file content
file_content = '''
package models

import (
	"database/sql"

	"github.com/golang-jwt/jwt/v4"
)

type Word struct {
	ID       int    `json:"id"`
	Japanese string `json:"japanese"`
	Romaji   string `json:"romanji"`
	English  string `json:"english"`
	Category string `json:"category"`
}

type User struct {
	ID       int        `json:"id"`
	Username string     `json:"username"`
	Password string     `json:"-"` // The "-" tag ensures the password is not included in JSON output
	Token    *jwt.Token `json:"-"`
}

type Progress struct {
	ID             int    `json:"id"`
	Username       string `json:"username"`
	LastUpdated    string `json:"last_updated"`
	WordId         int    `json:"word_id"`
	WordProgressId int    `json:"word_progress_id"`
}

type WordProgress struct {
	ID            int    `json:"id"`
	Username      string `json:"username"`
	WordID        int    `json:"word_id"`
	SeenCount     int    `json:"seen_count"`
	CorrectCount  int    `json:"correct_count"`
	LastAttempted string `json:"last_attempted"`
}
'''

# Parse the structs
structs = parse_structs(file_content)

# Generate and print the ERD
print(generate_erd(structs))