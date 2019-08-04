using Jakub_Rzepka_TreeStructure_Core.Models;
using Jakub_Rzepka_TreeStructure_Core.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Jakub_Rzepka_TreeStructure_Core.Repositories
{
    public interface INodeRepository
    {
        List<HomeVM> GetAllNodes();

        int AddNode(NodeVM nodeVM);

        void EditNode(NodeVM nodeVM);

        void DeleteNode(int id);
    }
}
