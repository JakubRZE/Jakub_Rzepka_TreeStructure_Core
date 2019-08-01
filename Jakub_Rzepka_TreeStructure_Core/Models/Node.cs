using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Jakub_Rzepka_TreeStructure_Core.Models
{
    public class Node
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int NodeId { get; private set; }

        public string Name { get; set; }

        public int? ParentNodeId { get; private set; }

        [ForeignKey("ParentNodeId")]
        public Node ParentNode { get; set; }

        public List<Node> SubNodes { get; set; }

        public Node()
        {
            SubNodes = new List<Node>();
        }
    }
}
